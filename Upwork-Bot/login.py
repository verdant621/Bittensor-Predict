

email_text = input("Email: ")

############################################################
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support import ui
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import *
from time import sleep
import os
import os.path

email = email_text.replace("\n","").replace(" ","").replace("\t","")
password = "P@ssw0rd123123"

def force(callback, debug=False):
	while True:
		sleep(0.5)
		try:
			callback()
			break
		except:
			pass
def clearInputText(element):
	element.send_keys(Keys.CONTROL + "a", Keys.DELETE) if element.get_attribute('value') !="" else None
def validInputText(element, text):
	if element.get_attribute('value') !=text: 
		raise ValueError("The element value is not equal to the expected text.")

def signIn(driver, email):
	###################### SING IN	##########################
	driver.get('https://www.upwork.com/ab/account-security/login')
	force(lambda:(
		clearInputText(driver.find_element(By.ID, "login_username")),
		driver.find_element(By.ID, "login_username").send_keys(email),
		validInputText(driver.find_element(By.ID, "login_username"), email)
		))
	driver.find_element(By.ID, 'login_password_continue').click()
	force(lambda:(
		clearInputText(driver.find_element(By.ID, "login_password")),
		driver.find_element(By.ID, "login_password").send_keys(password),
		validInputText(driver.find_element(By.ID, "login_password"), password)
		))
	driver.find_element(By.ID, "login_control_continue").click()

options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications" : 1}
options.add_experimental_option("prefs", prefs)
options.add_extension('ad_blocker.crx')
capabilities = options.to_capabilities()
capabilities['pageLoadStrategy'] = 'none'
driver=webdriver.Chrome(options=options)	
#########################################################################
while True:
	exitFlag = False
	handles = driver.window_handles
	for handle in handles:
		driver.switch_to.window(handle)
		# Check the URL of the current tab
		if 'https://getadblock.com/' in driver.current_url:
			# Close the tab
			driver.close()
			exitFlag = True
			break
	if exitFlag:
		break
handles = driver.window_handles
for handle in handles:
	driver.switch_to.window(handle)
#########################################################################
driver.get('chrome://settings/')
driver.execute_script('chrome.settingsPrivate.setDefaultZoom(0.67);')
signIn(driver,email)
while True:
	# user_input = input("Type 'quit' to close the browser\n")

	# # If user enters 'quit', close the browser and break the loop
	# if user_input.lower() == 'quit':
	# 	for driver in drivers:
	# 		driver.quit()
	# 	break
	sleep(3)
	try:
		if len(driver.window_handles)==0:
			break
	except:
		break
