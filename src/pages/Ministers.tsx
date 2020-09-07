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
  IonSearchbar,
  withIonLifeCycle
} from '@ionic/react';
import firebase from 'firebase';
import MinisterDetails from './MinisterDetails';

type State = {
  ministers: { [index: string]: any },
  ministersShown: { [index: string]: any },
  details: { [index: string]: any },
  actives: any[],
  loading: boolean,
  searchbar: null,
  open: boolean,
};
class Ministers extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {     
      ministers: {},
      ministersShown: {},
      details: {},
      actives: [],
      loading: true,
      searchbar: null,
      open: false,
    }
    this.closeMinisterDetails = this.closeMinisterDetails.bind(this);
  }

  ionViewWillEnter() {
    this.loadVolunteers();
  }

  loadVolunteers() {
    var ministers: {[k: string]: any} = {};
    firebase.database().ref('/lista-telefones').on('value', (ref) => {
      ref.forEach((cargo: any) => {
        ministers[cargo.key] = {"descricao": cargo.val()["descricao"], "voluntarios": []};
        cargo.forEach((voluntary: any) => {
          if(voluntary.val() !== cargo.val()["descricao"]){
            ministers[cargo.key]["voluntarios"].push(voluntary);
          }
        });
      });
      this.setState({ ministers, ministersShown: ministers, loading: false });
    });
  }

  closeMinisterDetails() {
    this.setState({open: false});
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

  createList() {
    let html = []
    let ministers = this.state.ministersShown;
    for (let key in ministers) {
      html.push(
        <IonItemGroup key={key}>
          <IonItemDivider onClick={() => this.setActives(key)}>
            <IonLabel>{ministers[key]["descricao"]}</IonLabel>
          </IonItemDivider>
          {this.createListItems(ministers[key]["voluntarios"], key)}
        </IonItemGroup>
      )
    }
    return html;
  }

  createListItems(voluntarios: any, key: string) {
    let html: any[] = [];
    let style = (!this.state.actives.includes(key)) ? {"display": 'None'} : {"display": 'inherit'};
    let _this = this;
    voluntarios.forEach(function (x: any) {
      html.push(
        <IonItem key={x.key} style={style} onClick={() => _this.setState({open: true, details: x.val()})}>
          <IonLabel>{x.val()["nome"]}</IonLabel>
        </IonItem>
      )
    });
    return html;
  }

  search(input: any) {
    this.setState({ loading: true });
    let search = input.detail.value.toLowerCase();
    let ministers = this.state.ministers;
    for (let cargo in ministers){
      ministers[cargo]["voluntarios"] = ministers[cargo]["voluntarios"].filter((x: any) => x.val().nome.toLowerCase().includes(search))
    }
    this.setState({ ministersShown: ministers, loading: false });
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
          <MinisterDetails open={this.state.open} details={this.state.details} close={this.closeMinisterDetails}/>
          <IonSearchbar placeholder="Busque por nome" onIonChange={(e) => this.search(e)}></IonSearchbar>
          
          <IonList>
            {this.createList()}            
          </IonList>

        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(Ministers);