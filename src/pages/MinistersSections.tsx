import React from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItemGroup,
  IonItemDivider,
  IonLoading,
  withIonLifeCycle
} from '@ionic/react';
import firebase from 'firebase';

type State = {
  sections: { [index: string]: any },
  details: { [index: string]: any },
  actives: any[],
  listKeys: any[],
  loading: boolean,
  searchbar: null,
  open: boolean,
};
class MinistersSections extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {     
      sections: {},
      details: {},
      actives: [],
      listKeys: [],
      loading: true,
      searchbar: null,
      open: false,
    }
  }

  ionViewWillEnter() {
    this.loadVolunteers();
  }

  loadVolunteers() {
    var sections: {[k: string]: any} = {};
    var listKeys: any[] = [];
    firebase.database().ref('/lista-telefones').on('value', (ref) => {
      ref.forEach((section: any) => {
        sections[section.key] = {"descricao": section.val()["descricao"], "cargos": []};
        listKeys.push({"descricao": section.val()["descricao"], "key": section.key});

        section.forEach((cargo: any) => {
          if(cargo.val() !== section.val()["descricao"]){
            sections[section.key]["cargos"].push(cargo);
          }
        });
      });

      listKeys.sort(function(a,b) {
          return (a.descricao > b.descricao) ? 1 : ((b.descricao > a.descricao) ? -1 : 0)
      });

      this.setState({ sections, listKeys, loading: false });
    });
  }

  setActives(cargo: string){
    let actives = this.state.actives;
    if (actives.includes(cargo)) {
      let index = actives.indexOf(cargo);
      if (index > -1) {
        actives.splice(index, 1);
      }
    } else {
      actives.push(cargo);
    }
    this.setState({ actives });
  }

  clickSection(key: string){
    document.getElementById(`btn-${key}`)?.click()
  }

  createList() {
    let html: any[] = []
    let sections = this.state.sections;
    let listKeys = this.state.listKeys;
    listKeys.forEach((x) => {
      if(sections[x.key] !== undefined){
        html.push(
          <IonItemGroup key={x.key}>
            <IonItemDivider onClick={() => this.clickSection(x.key)}>
                <IonLabel>{sections[x.key]["descricao"]}</IonLabel>
                <IonItem id={`btn-${x.key}`} style={{display: 'none'}} routerLink={`/ministers/${x.key}`}></IonItem>
            </IonItemDivider>
          </IonItemGroup>
        )
      }
    });
    return html;
  }

  render() {    
    return (      
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista Telefônica</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading}></IonLoading>
         
          <IonList>
            {this.createList()}            
          </IonList>

        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(MinistersSections);