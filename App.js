import React from 'react';
import NavigationBar from 'react-native-navbar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SectionList,
  ListView,
  StatusBar,
  ScrollView
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import { config } from './firebaseConfigs'
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

  componentDidMount() {
    const rootRef = firebase.database().ref('data');
    const listRef = rootRef.child('list');

    listRef.on('value', snap => {
      this.setState({
        list: snap.val()
      });
    });
  }

  writeNewElement(element) {
    const rootRef = firebase.database().ref('data');

    let newList = this.state.list;
    newList.push(element);

    rootRef.set({
      list: newList
    });
  }

  handleFieldOnChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  render() {
    return (
      <View style={styles.container}>
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
          <List style={styles.list}>
            {
              this.state.list.map((element, i) => {
                return (
                  <ListItem
                    key={i}
                    title={element}
                    style={styles.listItem}
                    hideChevron={true}
                  />
                );
              })
            }
            <ListItem
              style={styles.listItem}
              hideChevron={false}
              subtitle={"Add ToDo"}
              textInput={true}
              textInputPlaceholder={"Type here your new ToDo"}
              textInputReturnKeyType={"send"}
              textInputOnChangeText={(text) => this.handleFieldOnChange("newToDo", text)}
              onPress={this.writeNewElement(this.state.newToDo)}
            />
          </List>
        </ScrollView>
      </View>
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
