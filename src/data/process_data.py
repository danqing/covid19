from typing import List, Tuple
import json
from collections import defaultdict
from pprint import pprint
import csv
import re
import datetime

date_regex = r'(\d*)/(\d*)/(\d*)'


def get_date_fields(fieldnames: List[str]) -> List[Tuple[datetime.date, str]]:
    date_fieldnames = [
        fieldname for fieldname in fieldnames
        if re.match(date_regex, fieldname)
    ]

    date_fieldnames_with_dates = []
    for fieldname in date_fieldnames:
        match = re.match(date_regex, fieldname)
        month = int(match.group(1))
        day = int(match.group(2))

        date = datetime.date(year=2020, month=month, day=day)
        date_fieldnames_with_dates.append((date, fieldname))

    date_fieldnames_with_dates = sorted(date_fieldnames_with_dates)
    return date_fieldnames_with_dates


def process_file(input_file, output_file):
    jhu_rows = []

    start_date = datetime.date(year=2020, month=1, day=21)

    with open(input_file) as f_:
        reader = csv.DictReader(f_)

        date_fieldnames = get_date_fields(reader.fieldnames)

        for line in reader:
            cases = []

            for date, field in date_fieldnames:
                value = int(line[field])
                days_from_start = (date - start_date).days
                cases.append({'date': date.isoformat(), 'value': value, 'days_from_start': days_from_start})

            jhu_data = {
                'country': line['Country/Region'],
                'state': line['Province/State'],
                'cases': cases,
            }
            jhu_rows.append(jhu_data)

    # group countries together

    country_to_rows = defaultdict(list)
    for row in jhu_rows:
        country_to_rows[row['country']].append(row)

    country_rows = []
    for country, rows in country_to_rows.items():
        first_row = rows[0]
        first_row['state'] = ''
        cases = first_row['cases']

        for row in rows[1:]:
            for idx, case in enumerate(row['cases']):
                cases[idx]['value'] += case['value']

        country_rows.append(first_row)

    pprint(country_rows)

    output_lines = []
    for row in country_rows:
        for case in row['cases']:
            output_lines.append({
                'country': row['country'],
                'cases': case['value'],
                'year': case['days_from_start'],
                'code': '',
            })

    with open(output_file, 'w') as f_:
        f_.write(json.dumps(output_lines))


cases_in = '/Users/victor/Code/covid19/src/data/time_series_19-covid-Confirmed.csv'
cases_out = '/Users/victor/Code/covid19/src/data/jhu-confirmed.json'

deaths_in = '/Users/victor/Code/covid19/src/data/time_series_19-covid-Deaths.csv'
deaths_out = '/Users/victor/Code/covid19/src/data/jhu-deaths.json'

process_file(cases_in, cases_out)
process_file(deaths_in, deaths_out)
