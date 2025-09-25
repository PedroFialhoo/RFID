#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN   21   // SDA
#define RST_PIN  22   // RST

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin(18, 19, 23); // SCK=18, MISO=19, MOSI=23
  mfrc522.PCD_Init();
  delay(50);

  Serial.println("=== Teste de comunicação MFRC522 ===");

  // Lê a versão do firmware
  byte ver = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  Serial.print("Firmware MFRC522: 0x");
  Serial.println(ver, HEX);

  if (ver == 0x91 || ver == 0x92) {
    Serial.println("✅ Comunicação OK, leitor detectado!");
  } else {
    Serial.println("⚠ Falha na comunicação! Verifique fios/pinos/alimentação.");
  }

  Serial.println("=====================================");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (i > 0) uidStr += " ";             // adiciona espaço entre bytes
    if (mfrc522.uid.uidByte[i] < 0x10) uidStr += "0";  
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }

  Serial.println(uidStr);   // envia UID no formato: "43 6E C4 12"

  mfrc522.PICC_HaltA();
}

