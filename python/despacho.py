import time
import RPi.GPIO as GPIO
import requests

led_indicador = 15
bomba = 14
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(led_indicador, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(bomba, GPIO.OUT, initial=GPIO.LOW)

factor_agua = 50
bomba_encendida = False

def despachar(duration):
    global bomba_encendida
    if bomba_encendida == False:
        bomba_encendida = True
        GPIO.output(led_indicador, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(led_indicador, GPIO.LOW)
        time.sleep(0.25)
        GPIO.output(led_indicador, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(led_indicador, GPIO.LOW)
        time.sleep(0.25)
        GPIO.output(led_indicador, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(led_indicador, GPIO.LOW)
        time.sleep(0.25)
        GPIO.output(led_indicador, GPIO.HIGH)
        GPIO.output(bomba, GPIO.HIGH)
        time.sleep(duration)
        GPIO.output(bomba, GPIO.LOW)
        GPIO.output(led_indicador, GPIO.LOW)
        bomba_encendida = False

def getTicket():
    response = requests.get('http://agua.inteligente:8000/ticket/get_ticket_by_dispatcher_code?dispatcher_code=11223344').json()
    quantity = float(response['quantity']) / factor_agua
    if quantity > 0:
        despachar(quantity)

while True:
    if bomba_encendida == False:
        getTicket()
        time.sleep(1)
