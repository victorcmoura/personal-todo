import React from 'react';
import Expo from 'expo';
import NavigationBar from 'react-native-navbar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SectionList,
  ListView,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import {
  Toast,
  Root
} from 'native-base';
import { List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import { config } from './secrets'
import { Card } from 'react-native-elements'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      newToDo: ""
    };

    firebase.initializeApp(config);
  }

  componentWillMount() {
    Expo.Font.loadAsync({
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  componentDidMount() {
    console.log("Checking alterations on Firebase Database...")

    const listRef = firebase.database().ref("data");

    if (listRef == null) {

    }
    else {
      listRef.on('value', snap => {
        this.setState({
          list: snap.val()
        });
      });
    }

  }

  writeNewElement() {
    element = this.state.newToDo

    console.log(element)

    if (element == "") {
      alert("You can't create a blank ToDo");
    }
    else if (this.state.list != null) {
      if (this.state.list.includes(element)) {
        alert("ToDo already exists");
      }
      else {
        const rootRef = firebase.database().ref();

        let newList = this.state.list.slice();

        if (newList == null) {
          newList = []
        }

        newList.push(element);

        rootRef.set({
          data: newList
        });

        Toast.show({
          text: 'ToDo created',
          position: 'bottom',
          buttonText: 'Ok'
        });
      }
    }
    else {
      const rootRef = firebase.database().ref();

      let newList = [element]

      rootRef.set({
        data: newList
      });

      Toast.show({
        text: 'ToDo created',
        position: 'bottom',
        buttonText: 'Ok'
      });
    }
  }

  deleteElementFromList(index) {
    const rootRef = firebase.database().ref();

    let newList = this.state.list;

    newList.splice(index, 1);

    rootRef.set({
      data: newList
    });

    Toast.show({
      text: 'ToDo deleted',
      position: 'bottom',
      buttonText: 'Ok'
    });
  }

  editElement(index, element) {
    const rootRef = firebase.database().ref("data/" + index);

    if (element == "") {
      alert("Please write something to edit");
    }
    else {
      rootRef.set(element);

      Toast.show({
        text: 'ToDo edited',
        position: 'bottom',
        buttonText: 'Ok'
      });
    }
  }

  deleteElementAlert(element, index) {
    Alert.alert(
      "Delete ToDo",
      "Do you want to delete " + '"' + element + '"' + "?",
      [
        { text: 'Delete', onPress: () => this.deleteElementFromList(index) },
        { text: 'Cancel' }
      ]
    )
  }

  handleFieldOnChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  render() {
    return (
      <Root style={styles.container}>

        <StatusBar hidden={true} />
        <NavigationBar
          title={{ title: "Personal ToDo" }}
          style={styles.navBar}
        />
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={true}
          alwaysBounceHorizontal={true}
        >
          {this.state.list == null ?
            <List style={styles.list}>
              <ListItem
                style={styles.listItem}
                hideChevron={true}
                subtitle={"Add ToDo"}
                textInput={true}
                textInputPlaceholder={"Type here your new ToDo"}
                textInputReturnKeyType={"send"}
                textInputOnChangeText={(text) => this.handleFieldOnChange("newToDo", text)}
                onPress={() => this.writeNewElement()}
              />
            </List>
            :
            <List style={styles.list}>
              {
                this.state.list.map((element, i) => {
                  return (
                    <ListItem
                      key={i}
                      title={element}
                      style={styles.listItem}
                      hideChevron={true}
                      onLongPress={() => this.deleteElementAlert(element, i)}
                      onPress={() => this.editElement(i, this.state.newToDo)}
                    />
                  );
                })
              }
              <ListItem
                style={styles.listItem}
                hideChevron={true}
                subtitle={"Add ToDo"}
                textInput={true}
                textInputPlaceholder={"Type here your ToDo"}
                textInputReturnKeyType={"send"}
                textInputOnChangeText={(text) => this.handleFieldOnChange("newToDo", text)}
                onPress={() => this.writeNewElement()}
              />
            </List>
          }
        </ScrollView>

      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  scrollView: {

  },

  navBar: {

  },

  list: {

  },

  listItem: {

  },
});
