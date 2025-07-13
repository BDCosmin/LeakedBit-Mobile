import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Image, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import SinglesDisplay from '../../Upload/SinglesDisplay';

function OpenedDir({
  deleteSingleOrProject,
  playAudioPreview,
  isPlaying,
  playingIndex,
  currentTime,
  projectSingles,
  selectedProject,
  handleDeleteNote
}) {
  

  const itemsListed = [
    ...projectSingles.map((single, index) => ({ 
            type: 'single', 
            content: single, 
            idx: `single-${index}`, 
            s_uuid: `single-${single.s_id}`,  
            a_uuid: `project-${single.a_id}`  
        }))
      ];


  return (
    <>
      {itemsListed.length > 0 ? (
        itemsListed.map((item) => (
          item.type === 'single' ? (
            <SinglesDisplay
              key={`single-${item.s_uuid}`}  // Use item.id as the key
              single={item.content}
              index={item.id}  // Optionally pass the id if needed elsewhere
              deleteSingleOrProject={deleteSingleOrProject}
              playAudioPreview={playAudioPreview}
              isPlaying={isPlaying}
              playingIndex={playingIndex}
              currentTime={currentTime}
            />
          ) : (
            <View
              key={`note-${item.id}`}  // Use item.id as the key
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, padding: 10, backgroundColor: '#333', borderRadius: 5 }}
            >
              <Text style={{ color: '#fff', flex: 1 }}>{item.content}</Text>
              <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={{ marginLeft: 10 }}>
                <Text style={{ color: '#E3651D', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )
        ))
      ) : (
        <Text style={{ alignSelf: 'center', color: 'rgba(230, 230, 230, 0.5)', fontWeight: 'semibold', marginTop: 200 }}>
          Oops, looks like an empty album.
        </Text>
      )}
    </>

  );
}

            

// Exporting the OpenedDir component wrapped with React.memo for memoization
export default React.memo(OpenedDir);