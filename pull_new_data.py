from collections import defaultdict
import datetime
from pprint import pprint
import json
import csv
from io import StringIO

import requests

# daily_cases_file = '/Users/victor/Code/covid19/src/data/daily-cases-covid-19-who.csv'
#
# countries = set()
# with open(daily_cases_file) as f_:
#     reader = csv.DictReader(f_)
#     for line in reader:
#         countries.add(line['country'])
#
# country_json = []
# for country in countries:
#     if country == 'World':
#         continue
#     country_json.append({'name': country})
#
# print(json.dumps(country_json))

total_deaths = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/total_deaths.csv',
    'out': '/Users/victor/Code/covid19/src/data/total-deaths.json'
}
daily_deaths = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_deaths.csv',
    'out': '/Users/victor/Code/covid19/src/data/daily-deaths.json'
}
total_cases = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/total_cases.csv',
    'out': '/Users/victor/Code/covid19/src/data/total-cases.json'
}
daily_cases = {
    'in': 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/ecdc/new_cases.csv',
    'out': '/Users/victor/Code/covid19/src/data/daily-cases.json'
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


for info in infos:
    github_url = info['in']
    output_path = info['out']

    print('Processing', github_url)
    country_to_values = fetch_csv(github_url)
    output_json(country_to_values, output_path)
