import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { ref as dRef, remove } from 'firebase/database';
import { deleteObject, getDownloadURL, getStorage, listAll, ref as sRef, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import uuid from 'react-native-uuid';
import { database } from '../firebase/config';

import AddIntoProject from '../Upload/AddIntoProject';
import CreateNote from '../Upload/CreateNote';
import CreateProject from '../Upload/CreateProject';
import UploadModal from '../Upload/UploadModal';
import MainList from './dir/MainList';
import OpenedDir from './dir/OpenedDir';
import OpenedProjectNavbar from './dir/OpenedProjectNavbar';

export default function Library({
  submittedProjects,
  submittedSingles,
  saveToDatabaseSingle,
  saveToDatabaseProj,
  setSubmittedProjects,
  setSubmittedSingles,
  fetchUserName,
  name,
  setArtistName,
  userId,
  setUploadStatus,
  uploadStatus,
  setUploadedFileName,
  uploadedFileName,
  playAudioPreview,
  isPlaying,
  playingIndex,
  currentTime
}) { 
  const [projects, setProjects] = useState([]);
  const [singles, setSingles] = useState([]);

  const [createProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [addIntoPjVisible, setAddIntoPjVisible] = useState(false);
  const [createNoteModalVisible, setCreateNoteModalVisible] = useState(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [submittedProjectTitle, setSubmittedProjectTitle] = useState('');

  const [selectedProject, setSelectedProject] = useState(null);  // Track the currently selected project
  const [projectSingles, setProjectSingles] = useState([]);
  const [projectNotes, setProjectNotes] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [singleTitle, setSingleTitle] = useState('');
  const [submittedSingleTitle, setSubmittedSingleTitle] = useState('');
  const [genreSingle, setGenreSingle] = useState(''); // State for genre
  const [audio, setAudio] = useState(null);
  const [tempURL, setTempAudioURL] = useState(null);

  const [audioUploaded, setAudioUploaded] = useState(false);
  const [addedToProject, setAddedToProject] = useState(false);

  const [albumType, setAlbumType] = useState(''); // State for album type
  const [genreProject, setGenreProject] = useState(''); // State for genre
  
  const albumTypes = ['LP', 'EP', 'Mixtape'];
  const genres = ['Pop', 'Hip-Hop/Rap', 'R&B/Soul', 'Rock', 'Electronic', 'Folk', 'Classical', 'Other'];
  
  const [activeAlbumButton, setActiveAlbumButton] = useState(null); // State to track which button is active
  const [activeGenreButtonAlbum, setActiveGenreButtonAlbum] = useState(null); // State to track which button is active
  const [activeGenreButtonSingle, setActiveGenreButtonSingle] = useState(null);

  const [currentProject, setCurrentProject] = useState(null); // Store the selected project
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const [isVisible, setIsVisible] = useState(false);

  const newSingle = {
    s_id: uuid.v4(),
    a_id: null,
    title: singleTitle.trim(),
    genreSingle,
    audioURL: tempURL
  };

  const newProject = { 
    a_id: uuid.v4(),
    title: projectTitle.trim(),
    albumType, 
    genreProject
   };

  const uploadAudioFile = async (fileUri, mimeType) => {
    try {
      const storage = getStorage();
      const userStRef = sRef(storage, `audio/${name}'s singles/${newSingle.title}`); 
  
      // Fetch file as Blob
      const response = await fetch(fileUri);
      const blob = await response.blob();
  
      // Upload the file
      await uploadBytes(userStRef, blob, { contentType: mimeType });
      console.log('Temporary upload successful!');
  
      // Get the download URL
      const downloadURL = await getDownloadURL(userStRef);
      console.log('Temporary file available at', downloadURL);

      setAudioUploaded(true);
  
      return downloadURL; // Return URL for later use
    } catch (error) {
      console.error('Error uploading temporary audio file:', error);
      throw error; // Ensure the error is thrown to be caught in the calling function
    }
  };  

  const handleDownload = async (single) => {
    try {
      // Step 1: Get the Firebase Storage reference and download URL
      const storage = getStorage();
      
      // Assuming the single contains its title and is part of the selected project
      const singlePath = `audio/${name}'s projects/${selectedProject.title}/${single.title}`;
      const singleRef = sRef(storage, singlePath);
  
      // Get the download URL for the audio file
      const downloadUrl = await getDownloadURL(singleRef);
      
      // Step 2: Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library is required');
        return;
      }
  
      // Step 3: Extract file extension and create download path
      const parts = single.title.split('.'); // Extract extension from title
      const extension = parts[parts.length - 1];
      if (!extension) {
        console.error("Could not get the file's extension.");
        return;
      }
  
      const directory = FileSystem.documentDirectory + 'downloads/';
      const fileUri = directory + single.title; // Full file path
  
      // Step 4: Ensure the download directory exists
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }
  
      // Step 5: Download the file to the device
      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);
  
      // Step 6: Save the downloaded file to the media library
      const asset = await MediaLibrary.createAssetAsync(uri);
  
      // Optional: Create a custom album in the device's media library
      await MediaLibrary.createAlbumAsync('Music', asset, false);
  
      console.log('File downloaded successfully to:', uri);
      alert('Downloaded successfully to your Music folder!');
      
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  const deleteSingleOrProject = async (index, isProject, title) => {
    try {
      if (isProject) {
        // Remove the project from the list (UI update)
        setSubmittedProjects(prevProjects => prevProjects.filter((_, i) => i !== index));
        console.log('Project deleted at index:', index);
  
        const storage = getStorage();

        // Delete from Firebase Database and Storage
        const projRefDb = dRef(database, `users/${userId}/${name}'s projects/${title}`);
        const projRefSt = sRef(storage, `audio/${name}'s projects/${title}`);
        console.log(userId);
  
        // Delete from Realtime Database
        await remove(projRefDb);
        console.log('Project deleted from database.');
  
        // Delete from Storage
        await deleteObject(projRefSt);
        console.log('Project deleted from storage.');

      } else {
        // Remove the single from the list (UI update)
        setSubmittedSingles(prevSingles => prevSingles.filter((_, i) => i !== index));
        console.log('Single deleted at index:', index);
  
        const storage = getStorage();

        // Delete from Firebase Database and Storage
        const singleRefDb = dRef(database, `users/${userId}/${name}'s singles/${title}`);
        const singleRefSt = sRef(storage, `audio/${name}'s singles/${title}`);
        console.log(userId);
  
        // Delete from Realtime Database
        await remove(singleRefDb);
        console.log('Single deleted from database.');
  
        // Delete from Storage
        await deleteObject(singleRefSt);
        console.log('Single deleted from storage.');
      }
    } catch (error) {
      console.error('Error deleting single or project:', error);
      Alert.alert('Error', 'There was an error deleting the item.');
    }
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project); // Set the selected project as the current project
    setSelectedProject(project); // Set the selected project state
    setProjectSingles(project.singles || []); // Set the singles for the selected project, defaulting to an empty array if undefined
};

const loadProjectContent = async (project) => {
  try {
      // Validate the project before proceeding
      if (!project || !project.title) {
          console.error('Project is null or title is missing, content reset.');
          setProjectSingles([]);
          setProjectNotes([]);
          setSelectedProject(null);
          return; // Exit early if no project is valid
      }

      const storage = getStorage();
      const projectPath = `audio/${name}'s projects/${project.title}`;

      // Fetch all files inside the selected project
      const projectFilesRef = sRef(storage, projectPath);
      const filesList = await listAll(projectFilesRef);

      const singles = [];
      const notes = [];
      const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

      await Promise.all(
          filesList.items.map(async (itemRef) => {
              const fileName = itemRef.name;
              const downloadUrl = await getDownloadURL(itemRef);

              if (audioExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
                  singles.push({ title: fileName, downloadUrl });
              } else if (fileName.endsWith('.txt')) {
                  const noteContent = await fetch(downloadUrl).then(res => res.text());
                  notes.push({ title: fileName, content: noteContent });
              }
          })
      );

      setProjectSingles(singles);
      setProjectNotes(notes);
      setSelectedProject(project);
  } catch (error) {
      console.error('Error loading project content:', error);
  }
};

  // Function to handle button press, setting the active button
  const handleButtonPressAlbumType = (albumTypeButtonId) => {
    setActiveAlbumButton(albumTypeButtonId); // Set the active button based on the id
    albumTypePicker(albumTypeButtonId); // Update album type immediately
  };

  // Function to handle button press, setting the active button
  const handleButtonPressGenreAlbum = (genreButtonId) => {
    setActiveGenreButtonAlbum(genreButtonId); // Set the active button based on the id
    genrePickerAlbum(genreButtonId); // Update genre immediately
  };

  // Function to handle button press, setting the active button
  const handleButtonPressGenreSingle = (genreButtonId) => {
    setActiveGenreButtonSingle(genreButtonId); // Set the active button based on the id
    genrePickerSingle(genreButtonId); // Update genre immediately
  };

  const handleProjectSubmit = async () => {

    if (!newProject.title || !newProject.albumType || !newProject.genreProject) {
      Alert.alert('Error', 'Please fill in all fields.');    
      return;
    } 
    
    try {

        // Save to Firebase Database
        setSubmittedProjects(prevProjects => [...prevProjects, newProject]);

        // Use the selected album type and genre directly
        console.log('Album Title: ', newProject.title);
        console.log('Album ID: ', newProject.a_id);
        console.log('Type: ', newProject.albumType);
        console.log('Genre: ', newProject.genreProject);

        await saveToDatabaseProj(newProject, `${name}'s projects`, newProject.title);

        // Clear the project title input
        handleCloseModalAlbum();

    } catch(error) {
        Alert.alert('Error', 'There was an error while making this project.');
        console.error('Error saving the project:', error);
    }
  };

  const handleSingleSubmit = async () => {

    if (!newSingle.title || !newSingle.genreSingle || !audioUploaded) {
      Alert.alert('Error', 'Please fill in all fields.');
      console.log('State: ', audioUploaded);
      return;
    }
  
    try {
  
      // Save to Firebase Database
      setSubmittedSingles(prevSingles => [...prevSingles, newSingle]);

      // All the information stored for the new single
      console.log('Single Title: ', newSingle.title);
      console.log('Single ID: ', newSingle.s_id);
      console.log('Album ID: ', singleTitle.a_id);
      console.log('Genre: ', newSingle.genreSingle);
      console.log('Audio URL: ', newSingle.audioURL);
      console.log('State: ', audioUploaded);

      await saveToDatabaseSingle(newSingle, `${name}'s singles`, newSingle.title);
  
      // Reset states after submission
      handleCloseModalSingle();

    } catch (error) {
      Alert.alert('Error', 'There was an error while saving this single.');
      console.error('Error saving the single:', error);
    }
  };  

  const handleAddToPj = () => {
    // Check if a single is selected
    if (!selectedIndex) {
      Alert.alert('Error', 'Please select a single.'); // Show error if no single is selected
      return;
    }
  
    // Find the selected single using its s_id
    const selectedSingle = submittedSingles.find(single => single.s_id === selectedIndex);
    if (!selectedSingle) {
      Alert.alert('Error', 'Selected single not found.');
      return;
    }
  
    // Prepare updates with the selected single
    const updates = { single: selectedSingle };
    console.log("Selected Single to Add:", selectedSingle);
  
    // Submit the updates to the project
    submitToProject(updates);
  
    // Reset state after submission
    setSelectedIndex(null);
    setAddIntoPjVisible(false);
  };

  const submitToProject = async (updates) => {
  try {
    if (!selectedProject) {
      Alert.alert('Error', 'No project selected.');
      return;
    }

    const currentProjectId = selectedProject.title;

    // Update the project's singles list
    const updatedProject = {
      ...selectedProject,
      singles: [...(selectedProject.singles || []), updates.single], // Add the selected single
    };

    console.log("Updated Project:", updatedProject);

    // Update the list of projects
    setSubmittedProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.title === currentProjectId ? updatedProject : project
      )
    );

    Alert.alert('Success', 'Single added to the project.');
  } catch (error) {
    console.error('Error updating project:', error);
    Alert.alert('Error', 'Failed to update the project. Please try again.');
  }
};

    const handleDeleteNote = (noteIndex) => {
      const updatedNotes = selectedProject.notes.filter((_, index) => index !== noteIndex);

      const updatedProject = {
        ...selectedProject,
        notes: updatedNotes,
      };

      // Update the selected project state
      setSelectedProject(updatedProject);

      // Update the submitted projects list to reflect the deletion
      setSubmittedProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.title === selectedProject.title ? updatedProject : project
        )
      );
    };

  // Handle cancel/submit and clear selections when modal closes
  const handleCloseModalAlbum = () => {
    setCreateProjectModalVisible(false);
    setActiveAlbumButton(null); 
    setActiveGenreButtonAlbum(null); 
    setAlbumType(''); 
    setGenreProject(''); 
    setProjectTitle('');
    setAudioUploaded(false);
  };

  // Handle cancel/submit and clear selections when modal closes
  const handleCloseModalSingle = () => {
    setUploadModalVisible(false);
    setActiveGenreButtonSingle(null); 
    setGenreSingle('');
    setAudioUploaded(false);
    setTempAudioURL(null);
    setSingleTitle('');
    setUploadStatus(false);
    setUploadedFileName('');
  };

  const handleCloseAddModal = async () => {
    setAddIntoPjVisible(false);
  }

  const handleCloseCreateNoteModal = async () => {
    setCreateNoteModalVisible(false);
  }

  const handleBackPress = () => {
    setSelectedProject(null); // Resetting to show the main list
  };

  const albumTypePicker = (albumTypeButtonId) => {
    switch (albumTypeButtonId) {
      case 'lp':
        setAlbumType(albumTypes[0]);
        break;
      case 'ep':
        setAlbumType(albumTypes[1]);
        break;
      case 'mt':
        setAlbumType(albumTypes[2]);
        break;
      default:
        setAlbumType('');
        break;
    }
  };

  const genrePickerAlbum = (genreButtonId) => {
    switch (genreButtonId) {
      case 'pop':
        setGenreProject(genres[0]);
        break;
      case 'rap':
        setGenreProject(genres[1]);
        break;
      case 'rnb':
        setGenreProject(genres[2]);
        break;
      case 'rock':
        setGenreProject(genres[3]);
        break;
      case 'edm':
        setGenreProject(genres[4]);
        break;
      case 'folk':
        setGenreProject(genres[5]);
        break;
      case 'classic':
        setGenreProject(genres[6]);
        break;
      case 'other':
        setGenreProject(genres[7]);
        break;
      default:
        setGenreProject('');
        break;
    }
  };

  const genrePickerSingle = (genreButtonId) => {
    switch (genreButtonId) {
      case 'pop':
        setGenreSingle(genres[0]);
        break;
      case 'rap':
        setGenreSingle(genres[1]);
        break;
      case 'rnb':
        setGenreSingle(genres[2]);
        break;
      case 'rock':
        setGenreSingle(genres[3]);
        break;
      case 'edm':
        setGenreSingle(genres[4]);
        break;
      case 'folk':
        setGenreSingle(genres[5]);
        break;
      case 'classic':
        setGenreSingle(genres[6]);
        break;
      case 'other':
        setGenreSingle(genres[7]);
        break;
      default:
        setGenreSingle('');
        break;
    }
  };

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    fetchUserName(setArtistName);
  }, []);

  useEffect(() => {
    const animateColor = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColor();
  }, [animatedValue]);

  // Reset the values when the modal is opened
  useEffect(() => {
    if (createProjectModalVisible || uploadModalVisible) {
      // Reset the selections and input field when opening the modal
      setProjectTitle('');
      setSingleTitle('');
      setActiveAlbumButton(null);
      setActiveGenreButtonAlbum(null);
      setActiveGenreButtonSingle(null);
      setAlbumType('');
      setGenreProject('');
      setGenreSingle('');
      setAudio(null);
    }
  }, [createProjectModalVisible, uploadModalVisible]);

      useEffect(() => {
        const loadProjects = async () => {
            try {
                const storedProjects = await AsyncStorage.getItem(`${name}'s projects`);
                if (storedProjects) {
                    setSubmittedProjects(JSON.parse(storedProjects));
                }
            } catch (error) {
                console.error('Error loading projects from AsyncStorage:', error);
            }
        };

        loadProjects();
    }, [name]); // Add `name` as a dependency to re-run if it changes

    useEffect(() => {
        const saveProjects = async () => {
            try {
                await AsyncStorage.setItem(`${name}'s projects`, JSON.stringify(submittedProjects));
            } catch (error) {
                console.error('Error saving projects to AsyncStorage:', error);
            }
        };

        saveProjects();
    }, [submittedProjects]);

    useEffect(() => {
        const loadSingles = async () => {
            try {
                const storedSingles = await AsyncStorage.getItem(`${name}'s singles`);
                if (storedSingles) {
                    setSubmittedSingles(JSON.parse(storedSingles));
                }
            } catch (error) {
                console.error('Error loading singles from AsyncStorage:', error);
            }
        };

        loadSingles();
    }, [name]); // Add `name` as a dependency to re-run if it changes

    useEffect(() => {
        const saveSingles = async () => {
            try {
                await AsyncStorage.setItem(`${name}'s singles`, JSON.stringify(submittedSingles));
            } catch (error) {
                console.error('Error saving singles to AsyncStorage:', error);
            }
        };

        saveSingles();
    }, [submittedSingles]);

  return (
  <View className="flex-1 bg-[#222831] justify-between">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-start">
        <LinearGradient
          colors={['#FFFFFF', '#222831']}
          start={{ x: 0.7, y: -2 }}
          end={{ x: 0.7, y: 1 }}
        >
          <View className="flex-row items-center justify-between w-full pt-12 px-6 pb-3">        
            <View className="flex-col">
              <Animated.Text style={[{ color: animatedColor }]} className="text-[22px] font-bold text-white">
                LeakedBit
              </Animated.Text>
              <Text className="text-white text-[10px] self-start">Released. Unreleased.</Text>
            </View>

            <View className="flex-row items-center space-x-3">
              {selectedProject && (
                <TouchableOpacity onPress={handleBackPress}>
                  <Image
                    source={require('./assets/back.png')}
                    className="w-[35px] h-[35px] mt-[2px] mr-5"
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setUploadModalVisible(true)}>
                <Image
                  source={require('../Upload/assets/add-single.png')}
                  className="w-[35px] h-[35px] mr-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCreateProjectModalVisible(true)}>
                <Image
                  source={require('../Upload/assets/add-album.png')}
                  className="w-[35px] h-[35px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View className="h-[1px] w-full bg-[rgba(204,204,204,0.30)] self-center mb-[9px]" />

        <ScrollView className="w-full" contentContainerStyle={{ paddingBottom: 20 }}>
          {selectedProject ? (
            <OpenedDir
              deleteSingleOrProject={deleteSingleOrProject}
              playAudioPreview={playAudioPreview}
              isPlaying={isPlaying}
              playingIndex={playingIndex}
              currentTime={currentTime}
              selectedProject={selectedProject}
              projectSingles={projectSingles}
              handleDeleteNote={handleDeleteNote}
            />
          ) : (
            <MainList
              submittedProjects={submittedProjects}
              submittedSingles={submittedSingles}
              deleteSingleOrProject={deleteSingleOrProject}
              setAddIntoPjVisible={setAddIntoPjVisible}
              handleProjectSelect={handleProjectSelect}
              handleDownload={handleDownload}
              playAudioPreview={playAudioPreview}
              isPlaying={isPlaying}
              playingIndex={playingIndex}
              currentTime={currentTime}
            />
          )}
        </ScrollView>

        {selectedProject && (
          <OpenedProjectNavbar project={selectedProject} />
        )}
      </View>
    </TouchableWithoutFeedback>

    {/* Modals */}
    <CreateProject
      {...{ createProjectModalVisible, setCreateProjectModalVisible, handleProjectSubmit, handleCloseModalAlbum,
      activeAlbumButton, handleButtonPressAlbumType, activeGenreButtonAlbum, handleButtonPressGenreAlbum,
      projectTitle, setProjectTitle }}
    />
    <UploadModal
      {...{ uploadModalVisible, setUploadModalVisible, handleSingleSubmit, handleButtonPressGenreSingle,
      handleCloseModalSingle, activeGenreButtonSingle, singleTitle, setSingleTitle, audio, uploadAudioFile,
      setTempAudioURL, setUploadedFileName, uploadedFileName, setUploadStatus, uploadStatus }}
    />
    <AddIntoProject
      {...{ addIntoPjVisible, setAddIntoPjVisible, handleCloseAddModal, submittedSingles, singleTitle,
      handleAddToPj, noteContent, setNoteContent, createNoteModalVisible, setCreateNoteModalVisible,
      selectedIndex, setSelectedIndex, newSingle }}
    />
    <CreateNote
      {...{ createNoteModalVisible, setCreateNoteModalVisible, handleCloseCreateNoteModal,
      noteTitle, setNoteTitle, noteContent, setNoteContent }}
    />
    <StatusBar style="auto" />
  </View>
);
}

