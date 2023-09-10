#include <PubSubClient.h>

#include <Wire.h>
#include <WiFi.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "credentials.h"

#define OLED_WIDTH 128
#define OLED_HEIGHT 64

#define LED_PIN 4

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

const char *mqttServer = MQTT_SERVER;
const int mqttPort = MQTT_PORT;
const char *mqttUser = MQTT_USERNAME;
const char *mqttPassword = MQTT_PASSWORD;
bool lights = false;

WiFiClient espClient;
PubSubClient client(espClient); // MQTT client object using the WiFi client object

void setup_wifi()
{
  delay(10);
  // Connect to WiFi network
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  Serial.println("Wifi Connected!");
  Serial.println(WiFi.localIP());
}

void callback(char *topic, byte *payload, unsigned int length)
{
  String message;
  Serial.println("Callback ran");
  for (int i = 0; i < length; i++)
  {
    message += (char)payload[i];
  }

  if (message == "LIGHTS")
  {
    lights = !lights;
    digitalWrite(2, lights);
    Serial.println("Light Switched!");
  }
}

void reconnect()
{
  while (!client.connected())
  {
    if (client.connect("ESP32Client", mqttUser, mqttPassword))
    {
      Serial.println("Client Connected");
    }
    else
    {
      delay(5000);
    }
  }
}
void setup()
{

  pinMode(2, OUTPUT);

  Serial.begin(115200);

  setup_wifi();

  client.setServer(mqttServer, mqttPort); // Set MQTT server

  client.setCallback(callback);

  if (client.connect("ESP32Client", mqttUser, mqttPassword))
  {
    Serial.println("connected");
    Serial.println(client.state());

    if (client.state() == 0)
    {
      client.subscribe("/home/light");
    }

    switch (client.state())
    {
    case -4:
      Serial.println("Connection timeout");
      break;
    case -3:
      Serial.println("Connection lost");
      break;
    case -2:
      Serial.println("Connect failed");
      break;
    case -1:
      Serial.println("Disconnected");
      break;
    case 1:
      Serial.println("Bad protocol");
      break;
    case 2:
      Serial.println("Bad client ID");
      break;
    case 3:
      Serial.println("Unavailable");
      break;
    case 4:
      Serial.println("Bad credentials");
      break;
    case 5:
      Serial.println("Unauthorized");
      break;
    }
  }
  else
  {
    Serial.print("failed with state ");
    Serial.print(client.state());
    delay(2000);
  }
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
}
