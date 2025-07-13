import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

export default function OpenedProjectNavbar({ 
  project
}) {
    return (
      <View style={{ paddingBottom: 5, backgroundColor: '#f68504' }}>
        <View style={styles.dirNavbar}>
          {project ? (
            <>
              <View style={styles.iconOpenedProj}>
                <Image source={require('../../Upload/assets/open-folder.png')} style={{width: 30, height: 25}}/>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.projTitle}>{project.title}</Text>
                <Text style={styles.projGenreTitle}>{project.genreProject}</Text>
              </View>
            </>
          ) : (
            <Text>No project selected</Text> // Optional fallback
          )}
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    dirNavbar: {
        flexDirection: 'row', 
        width: '100%',
        height: 25      
    },
    projTitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 'bold',
        marginLeft: 12,
        paddingTop: 5
    },
    projGenreTitle: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.9)',
        marginLeft: 5,
        paddingTop: 9,
        marginRight: 200
    },
    iconOpenedProj: {
        width: 30, 
        height: 25,
        marginLeft: 10,
        paddingTop: 2
    },
    divider: {
        height: 1, // Height of the line
        width: '100%', // Width of the line
        backgroundColor: 'rgba(204, 204, 204, 0.30)', // Color of the line
        alignSelf: 'center',
        marginTop: 5
    }
});
