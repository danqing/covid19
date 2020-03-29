from collections import defaultdict
import datetime
from pprint import pprint
import json
import csv
from io import StringIO
import requests

from algoliasearch.search_client import SearchClient

client = SearchClient.create('3BK81OKMN1', 'f39a377b20879977bdb641f002ebf8db')
index = client.init_index('covid')

total_deaths = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/total_deaths.csv',
    'out': 'src/data/total-deaths.json'
}
daily_deaths = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_deaths.csv',
    'out': 'src/data/daily-deaths.json'
}
total_cases = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/total_cases.csv',
    'out': 'src/data/total-cases.json'
}
daily_cases = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_cases.csv',
    'out': 'src/data/daily-cases.json'
}

infos = [total_deaths, daily_deaths, total_cases, daily_cases]


def fetch_csv(url: str):
    resp = requests.get(url)
    string_io = StringIO(resp.text)
    reader = csv.DictReader(string_io)

    countries = [field for field in reader.fieldnames if field not in ['date']]

    country_to_values = defaultdict(list)

    for line in reader:
        date = datetime.date.fromisoformat(line['date'])

        for country in countries:
            country_to_values[country].append({'date': date, 'value': int(float(line[country] or 0))})
    return country_to_values


start_date = datetime.date(year=2020, month=1, day=21)


def output_json(country_to_values, output_dest: str):
    output_array = []

    for country, values in country_to_values.items():
        if country == 'World':
            country = 'Worldwide'

        for value in values:
            days = (value['date'] - start_date).days
            output_array.append({
                'country': country,
                'code': '',
                'year': days,
                'cases': value['value'],
            })

    with open(output_dest, 'w') as f_:
        json.dump(output_array, f_)


def update_index(url: str):
    resp = requests.get(url)
    string_io = StringIO(resp.text)
    reader = csv.DictReader(string_io)

    countries = [field for field in reader.fieldnames if field not in ['date']]
    index_objects = [{'name': country, 'objectID': country} for country in countries if country != 'World']
    index_objects.append({'name': 'Worldwide', 'objectID': 'World'})

    index.replace_all_objects(index_objects)


update_index(daily_cases['in'])

for info in infos:
    github_url = info['in']
    output_path = info['out']

    print('Processing', github_url)
    country_to_values = fetch_csv(github_url)
    output_json(country_to_values, output_path)
