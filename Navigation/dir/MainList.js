import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Image, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import ProjectsDisplay from '../../Upload/ProjectsDisplay'; 
import SinglesDisplay from '../../Upload/SinglesDisplay';

function MainList ({
    submittedProjects,
    submittedSingles,
    deleteSingleOrProject,
    setAddIntoPjVisible,
    handleProjectSelect,
    handleDownload,
    playAudioPreview,
    isPlaying,
    playingIndex,
    currentTime,
  }) {
    return (
      <>
        {/* Display all projects */}
        {submittedProjects.map((project, index) => (
          <ProjectsDisplay
            key={`project-${index}`}
            project={project}
            index={index}
            deleteSingleOrProject={deleteSingleOrProject}
            setAddIntoPjVisible={setAddIntoPjVisible}
            handleProjectSelect={handleProjectSelect}
            isPlaying={isPlaying}
          />
        ))}
  
        {/* Display all singles */}
        {submittedSingles.map((single, index) => (
          <SinglesDisplay
            key={`single-${index}`}
            single={single}
            index={index}
            deleteSingleOrProject={deleteSingleOrProject}
            handleDownload={handleDownload}
            playAudioPreview={playAudioPreview}
            isPlaying={isPlaying}
            playingIndex={playingIndex}
            currentTime={currentTime}
          />
        ))}
      </>
    );
  };

// Exporting the MainList component wrapped with React.memo for memoization
export default React.memo(MainList);