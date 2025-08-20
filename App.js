import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import axios from "axios";

const API_KEY = 'AQUI FICA A CHAVE PARA CONEXÃO COM A API'

export default function App() {
  const [caracteristicas, setCaracteristicas] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarParaGemini = async (caracteristicasUsuario) => { 
    if (loading) return;
    setLoading(true);
    setRespostaIA("Enviando para Gemini...");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: `Um usuário descreveu suas características: ${caracteristicasUsuario}.
                Sugira qual abordagem psicológica pode ser mais adequada e explique de forma simples.` }
              ]
            }
          ]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      setRespostaIA(response.data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.log(err);
      setRespostaIA("❌ Ocorreu um erro ao conectar com a API do Gemini. Verifique sua conexão ou a chave da API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Indicação de Abordagem Psicológica</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite suas características..."
        value={caracteristicas}
        onChangeText={(text) => setCaracteristicas(text)}
        multiline
      />

      <Button 
        title={loading ? "Enviando..." : "Enviar"} 
        onPress={() => enviarParaGemini(caracteristicas)} 
        disabled={loading} 
      />

      <ScrollView style={styles.respostaBox}>
        <Text style={styles.resposta}>{respostaIA}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 40
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 80
  },
  respostaBox: {
    marginTop: 20
  },
  resposta: {
    fontSize: 16,
    color: "#333"
  }
});