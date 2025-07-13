import { View, Text, Modal, TextInput, TouchableOpacity, Keyboard, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function AddIntoProject({ 
  addIntoPjVisible,
  setAddIntoPjVisible,
  handleCloseAddModal,
  submittedSingles,
  noteContent, 
  setNoteContent,
  handleAddToPj,
  createNoteModalVisible,
  setCreateNoteModalVisible,
  selectedIndex,
  setSelectedIndex,
  newSingle
}) {

    return (
        <Modal            
            animationType="slide"
            transparent={true}
            visible={addIntoPjVisible}
            onRequestClose={() => setAddIntoPjVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <Image source={require('./assets/songs-folder.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
                        <Text style={styles.modalTitle}>Add a track</Text>
                    </View>         
                    <View style={{flexDirection: 'column'}}> 
                        <Text style={styles.modalSubTitle}>Choose from the existing songs:</Text>
                    </View>       
                          
                    <ScrollView contentContainerStyle={{ height: 180, width: 250, backgroundColor: '#222831' }}>
                    {submittedSingles.map((single) => (
                      <View key={`single-${single.s_id}`}>
                        <TouchableOpacity
                          style={[
                            styles.itemListed,
                            { backgroundColor: selectedIndex === single.s_id ? '#E3651D' : '#cfcfcf' },
                          ]}
                          onPress={() => setSelectedIndex(single.s_id)} // Save the selected single's s_id
                        >
                          <View style={{ flexDirection: 'row', width: '60%' }}>
                            <Image
                              source={require('../Upload/assets/disc.png')}
                              style={{ width: 20, height: 20, marginRight: 8, marginTop: 2 }}
                              resizeMode="contain"
                            />
                            <Text style={styles.itemListedTitle}>{single.title}</Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.dividerItems} />
                      </View>
                      ))}
                    </ScrollView>

                    <View style={{height: 30}}>

                    </View>
                    
                    <View style={{flexDirection: 'column', alignSelf: 'flex-start'}}>
                        <Text style={{fontSize: 10, color: '#383838', fontWeight: 'bold', marginBottom: 7}}>...or write a note to attach to:</Text>
                    </View>
                    <View style={{width: '42%', height: 125, marginBottom: 15, alignSelf: 'flex-start'}}>
                      <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {setAddIntoPjVisible(false); setCreateNoteModalVisible(true)}}>
                        <Text style={styles.modalButtons}>Create...</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalButtonsSection}>
                        <TouchableOpacity 
                            style={{backgroundColor: '#222831', borderRadius: 5}} 
                            onPress={() => { handleAddToPj() }}
                        >
                            <Text style={styles.modalButtons}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{backgroundColor: '#222831', borderRadius: 5}} 
                            onPress={() => { handleCloseAddModal() }}
                        >
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
    height: 500,
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
  itemListed: {
    padding: 5,  
    width: '100%',
    justifyContent: 'space-between'
  },
  itemListedTitle: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#fff'
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
  dividerItems: {
    height: 1, // Height of the line
    width: '100%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.8)', // Color of the line
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
  inputProjectName: {
  width: '100%', 
  height: 125, 
  backgroundColor: '#ededed',
  paddingVertical: 5, 
  paddingLeft: 5,
  borderRadius: 5,
  textAlignVertical: 'top'
  }
});
