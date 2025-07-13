import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

export default function SinglesDisplay({ 
    single, 
    index, 
    deleteSingleOrProject,
    handleDownload,
    playingIndex,
    isPlaying,
    playAudioPreview,
    currentTime
}) {
  return (
    <View key={`single-${index}`}>
            <TouchableOpacity style={[styles.itemListed, playingIndex === index && styles.activeItem]} onPress={() => playAudioPreview(single, index)} disabled={isPlaying}>
              <View style={{ flexDirection: 'row', width: '60%' }}>
                <Image source={playingIndex === index ? require('./assets/music-playing.png') : require('./assets/disc.png')} style={{ width: 20, height: 20, marginRight: 8, marginTop: 2 }} resizeMode="contain" />
                <Text style={styles.itemListedTitle}>{single.title}</Text>
                {playingIndex === index && (
                  <Text style={styles.timerText}>{currentTime}</Text>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 2}}>
                <Text style={styles.itemListedDetails}>Single</Text>
                <TouchableOpacity style={styles.actionItem} onPress={() => handleDownload(single)}>
                  <Image source={require('../Navigation/assets/download.png')} style={{ width: 17, height: 17, marginTop: 1}} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={() => deleteSingleOrProject(index, false, single.title)} disabled={isPlaying}>
                  <Image source={require('../Navigation/assets/trash.png')} style={{ width: 17, height: 17}} resizeMode="contain" />
                </TouchableOpacity>
              </View>             
            </TouchableOpacity>
            <View style={styles.dividerItems} />
          </View>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    width: 'auto',
    marginTop: -3, 
    marginRight: 5, 
    backgroundColor: 'rgba(227, 101, 28, 0.5)',
    padding: 5,
    borderRadius: 6
  },
  itemListed: {
    flexDirection: 'row',
    padding: 10,  
    width: '100%',
    justifyContent: 'space-between'
  },
  itemListedTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff'
  },
  itemListedDetails: {
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#e3e3e3',
    backgroundColor: 'rgba(227, 101, 28, 0.3)',
    padding: 2,
    paddingTop: 6,
    paddingLeft: 7,
    paddingRight: 7,
    height: 30,
    marginRight: 7,
    marginTop: -4,
    borderRadius: 6
  },
  dividerItems: {
    height: 1, // Height of the line
    width: '100%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.1)', // Color of the line
    alignSelf: 'center',
  },
  activeItem: {
    backgroundColor: 'rgba(0, 56, 34, 0.65)',
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 9,
    marginRight: 30,
    marginLeft: 8,
    marginTop: 7
  }
});