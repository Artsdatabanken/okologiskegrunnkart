# To get the necessary file:
# 1. Go to relevant Geonorge link, for example
#    'https://objektkatalog.geonorge.no/Objekttype/Index/EAID_C8092167_3AF8_4668_BDA5_5EBE69CB3645'
#    and download the csv file
# 2. Make sure the path to the downloaded csv file is correct


# To run from the console:
# 1. Go the the directory where the file is located
# 2. In Windows, write: `python convert_geonorge_codelist_json.py`
#    or `python3 convert_geonorge_codelist_json.py`

import csv 
import json

csvFilePath = 'objektkatalogen.csv'
jsonFilePath = 'DN13.json'

      
# create a dictionary 
data = {} 
    
# Open a csv reader called DictReader 
with open(csvFilePath, encoding='utf-8-sig') as csvf: 
    csvReader = csv.DictReader(csvf, delimiter=';')
        
    # Convert each row into a dictionary  
    # and add it to data 
    for rows in csvReader:
        # print(rows)
            
        # Modify elements
        # Norwegian
        key = rows['Initialverdi']
        rows['code'] = rows['Kode']
        name = rows['Kode']
        rows['initial_value'] = rows['Initialverdi']
        rows['description'] = rows['Beskrivelse']
        rows['name_english'] = rows['Navn engelsk']
        rows['description_english'] = rows['Beskrivelse engelsk']
        del rows['Kode']
        del rows['Initialverdi']
        del rows['Beskrivelse']
        del rows['Navn engelsk']
        del rows['Beskrivelse engelsk']
        
        # # English
        # key = rows['Initial value']
        # rows['code'] = rows['Code']
        # name = rows['Code']
        # rows['initial_value'] = rows['Initial value']
        # rows['description'] = rows['Description']
        # rows['name_english'] = rows['Name english']
        # rows['description_english'] = rows['Description english']
        # del rows['Code']
        # del rows['Initial value']
        # del rows['Description']
        # del rows['Name english']
        # del rows['Description english']

        # Improve name's readibility
        new_list = []
        count = 0
        for char in name:
            if count == 0:
                new_list.append(char.upper())
            elif char.upper() == char and char.isupper():
                new_list.append(" " + char.lower())
            else:
                new_list.append(char)
            count += 1

        new_name = ''.join(new_list)
        rows['name'] = new_name

        # Set the key and content
        data[key] = rows 

# Open a json writer, and use the json.dumps()  
# function to dump data 
with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
    jsonf.write(json.dumps(data, indent=2, ensure_ascii=False)) 
