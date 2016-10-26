#coding=utf-8
import requests
from bs4 import BeautifulSoup
import json

## Download all courses for spring 2016 and spring 2017
deps = ['AAS', 'AEM', 'AEP', 'AGSCI', 'AIIS', 'AIRS', 'ALS', 'AMST', 'ANSC', 'ANTHR', 'ARCH', 'ARKEO', 'ART', 'ARTH', 'AS', 'ASIAN', 'ASRC', 'ASTRO', 'BCS', 'BEE', 'BENGL', 'BIOAP', 'BIOEE', 'BIOG', 'BIOMG', 'BIOMI', 'BIOMS', 'BIONB', 'BIOSM', 'BME', 'BPRE', 'BSOC', 'BTRY', 'BURM', 'CAPS', 'CEE', 'CHEM', 'CHEME', 'CHENE', 'CHIN', 'CHLIT', 'CLASS', 'COGST', 'COLLS', 'COML', 'COMM', 'CRP', 'CS', 'CZECH', 'DEA', 'DSOC', 'DUTCH', 'EAS', 'ECE', 'ECON', 'EDUC', 'ENGL', 'ENGRC', 'ENGRD', 'ENGRG', 'ENGRI', 'ENTOM', 'ESS', 'FDSC', 'FGSS', 'FREN', 'FSAD', 'GERST', 'GOVT', 'GREEK', 'HADM', 'HD', 'HE', 'HINDI', 'HIST', 'HUNGR', 'IARD', 'ILRHR', 'ILRIC', 'ILRID', 'ILRLE', 'ILRLR', 'ILROB', 'ILRST', 'IM', 'INDO', 'INFO', 'ITAL', 'JAPAN', 'JPLIT', 'JWST', 'KHMER', 'KOREA', 'KRLIT', 'LA', 'LATA', 'LATIN', 'LAW', 'LGBT', 'LING', 'LSP', 'MAE', 'MATH', 'MEDVL', 'MILS', 'MSE', 'MUSIC', 'NAVS', 'NBA', 'NBAY', 'NCC', 'NCCY', 'NEPAL', 'NES', 'NMI', 'NRE', 'NS', 'NSE', 'NTRES', 'ORIE', 'PADM', 'PALI', 'PAM', 'PE', 'PHIL', 'PHYS', 'PLBIO', 'PLBRG', 'PLHRT', 'PLPPM', 'PLSCI', 'PLSCS', 'PMA', 'POLSH', 'PORT', 'PSYCH', 'PUNJB', 'RELST', 'ROMAN', 'ROMS', 'RUSSA', 'RUSSL', 'SANSK', 'SEA', 'SHUM', 'SINHA', 'SOC', 'SPAN', 'STS', 'STSCI', 'SYSEN', 'TAG', 'TAMIL', 'THAI', 'TIBET', 'TOX', 'UKRAN', 'URDU', 'VETCS', 'VETMI', 'VETMM', 'VIEN', 'VIET', 'VISST', 'VTBMS', 'VTMED', 'VTPMD', 'WRIT']
sems = ['SP16', 'FA16']
for sem in sems:
	for dep in deps:
		response = requests.get('https://classes.cornell.edu/api/2.0/search/classes.json?roster='+sem+'&subject={}'.format(dep))
		with open(dep+'_'+sem+'.json', 'w') as f:
			try:
				content = response.content
			except UnicodeEncodeError as e:
				print(e.args)
			if '<' in content:
				print(dep)
				continue
			f.write(content)


## Find all departments
# response = requests.get('https://classes.cornell.edu/browse/roster/SP17').content.decode()
# soup = BeautifulSoup(response, 'html.parser')
# departments = {}
# for department in soup(attrs={'class':'subject-group'}):
# 	s = department.findAll('li')[0].text
# 	l = department.findAll('li')[1].text
# 	departments[s] = l

# with open('departments.json', 'w') as f: 
# 	f.write(json.dumps(departments))




