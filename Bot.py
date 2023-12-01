import pyautogui
import keyboard
import time
import random

# Start with the bot paused.
bot_paused = False

def toggle_pause():
    '''
    Function that toggles the pause state of the bot.
    '''
    global bot_paused
    bot_paused = not bot_paused

# Set up a hotkey (in this case 'ctrl + shift + a') to start/stop the bot.
keyboard.add_hotkey('alt+tab', toggle_pause)

def smooth_scroll():
    pyautogui.scroll(random.randint(-30, 30))
    time.sleep(random.uniform(0.1, 0.3))

action_functions = [
    lambda: pyautogui.moveTo(random.randint(0, pyautogui.size()[0]), random.randint(0, pyautogui.size()[1]), duration=1.5),  # smooth mouse move
    lambda: keyboard.press_and_release('ctrl'),  # press ctrl
    smooth_scroll,  # smooth mouse scrolls
    lambda: pyautogui.hotkey('ctrl', 'tab')
]

while True:
    # Always check if the bot is supposed to be paused.
    while not bot_paused:
        # Perform a random action
        random.choice(action_functions)()
        time.sleep(2)  # sleep for 2 seconds before performing another action

    time.sleep(0.1)