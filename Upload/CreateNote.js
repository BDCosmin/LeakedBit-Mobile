import { View, Text, Modal, TextInput, TouchableOpacity, Keyboard, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function CreateNote({ 
  createNoteModalVisible,
  setCreateNoteModalVisible,
  handleCloseCreateNoteModal,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent
   }) {

  return (
    <Modal            
      animationType="slide"
      transparent={true}
      visible={createNoteModalVisible}
      onRequestClose={() => setCreateNoteModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <Image source={require('./assets/note.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Add a new note</Text>
          </View>
          
          <View style={{width: '100%'}}>
            <TextInput style={styles.inputNoteTitle} placeholder="Note title..." value={noteTitle} onChangeText={text => setNoteTitle(text)} multiline={true} numberOfLines={1} />
          </View>
          
          <View style={{width: '100%', height: 125, marginBottom: 15}}>
                <TextInput
                    style={styles.inputNoteContent}
                    value={noteContent}
                    onChangeText={text => setNoteContent(text)}
                    placeholder="Note content goes here..."
                    multiline={true}
                    numberOfLines={8}
                />
            </View>

          <View style={{marginTop: 55, marginBottom: 15}}>
            <Text style={styles.notesTitle}>Important:</Text>
            <Text style={styles.notesText}>Make sure you use notes to describe the state of your album.</Text>
            <Text style={styles.notesText}>The action of attaching notes is recommended to be used once per project.</Text>
          </View>

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleCloseCreateNoteModal()}}>
              <Text style={styles.modalButtons}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleCloseCreateNoteModal()}}>
              <Text style={styles.modalButtons}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    height: 480,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222831'
  },
  modalSubTitle: {
    fontSize: 14,
    color: '#222831',
    fontWeight: 'bold',
    marginBottom: 7
  },
  inputNoteTitle: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 10
  },
  inputNoteContent: {
    width: '100%',
    height: 185,
    borderColor: '#ccc', 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
  },
  autoCompInputs: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 20
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButtons: { 
    color: '#fff',
    fontWeight: 'bold', 
    paddingLeft: 25, 
    paddingRight: 25, 
    paddingTop: 12, 
    paddingBottom: 12
  },
  modalLabels: {
    padding: 10,
    borderRadius: 2,
    marginRight: 5
  },
  notesTitle: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold'
  },
  notesText: {
    fontSize: 12,
    color: 'gray'
  },
  uploadBox: {
    backgroundColor: 'yellow',
    padding: 4,
    width: 75,
    paddingLeft: 15
  }
});
