import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonSpinner,
  IonButton,
  IonIcon,
  IonImg,
  withIonLifeCycle
} from '@ionic/react';
import { withRouter } from 'react-router';
import firebase from 'firebase';
import React from 'react';
import './Churches.css';
import ChurchesFilterModal from './ChurchesFilterModal';
import { search } from 'ionicons/icons';

type State = {
  churches: { [index: string]: any },
  churchesShown: { [index: string]: any },
  filters: { [index: string]: any },
  loading: boolean,
  showModal: boolean
};

class Churches extends React.Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      churches: {},
      churchesShown: {},
      filters: {
        events: []
      },
      loading: true,
      showModal: false
    }
    this.getImage = this.getImage.bind(this);
    this.search = this.search.bind(this);
  }

  async ionViewWillEnter() {
    this.loadChurches();
  }

  async loadChurches() {
    let churches = await firebase.database().ref(`/churches`).once('value');
    this.addListChurches(churches);
  }

  async addListChurches(entity: any) {
    let churches = this.state.churches;
    let getImage = this.getImage;
    entity.forEach((element: any) => {
      churches[element.key] = element.val()
      churches[element.key]['key'] = element.key
      churches[element.key]['loadingImg'] = true
      getImage(element.val()['imgUrl'], element.key)
    });

    this.setState({ churches, churchesShown: churches, loading: false });
  }

  async getImage(ref: string, key: string) {
    let storage = firebase.storage();
    let path = await storage.ref(ref).getDownloadURL();
    let churches = this.state.churches;
    churches[key]['imgUrl'] = path;
    churches[key]['loadingImg'] = false;
    this.setState({ churches, churchesShown: churches });
  }

  createListItems() {
    let html: any[] = [];
    let churches = this.state.churchesShown;
    for (let church in churches) {
      html.push(
        <IonItem href={`/churches/${church}`} key={church}>
          <IonCard className="welcome-card">

            {churches[church].loadingImg &&
              <div className="spin">
                <IonSpinner />
              </div>
            }
            {!churches[church].loadingImg &&
              <IonImg className="main-img" src={churches[church].imgUrl} />
            }

            <IonCardHeader>
              <IonCardTitle>{churches[church].place} - {churches[church].name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Cultos: {churches[church].cults}</p>
            </IonCardContent>
          </IonCard>
        </IonItem>
      )
    }
    return html;
  }

  showModal() {
    this.setState({ showModal: true });
  }

  search(filters: any) {
    let churches = this.state.churches;
    let churchesShown: { [index: string]: any } = {};
    let churchesFiltered = Object.keys(churches).map(i => churches[i])
    
    if (filters.events.includes("cults")){
      churchesFiltered = churchesFiltered.filter(i => i.cults.includes(filters.days))
    }

    if (filters.events.includes("rehearsals")){
      churchesFiltered = churchesFiltered.filter(i => i.rehearsals !== undefined && i.rehearsals.weekDay.includes(filters.days));
    }

    churchesFiltered = churchesFiltered.filter(i => i.name.toLowerCase().includes(filters.search))
    churchesFiltered.forEach(x => churchesShown[x.key] = x);
    this.setState({ churchesShown, showModal: false });
  }

  render() {
    return (
      <IonPage>

        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" onClick={() => this.showModal()}>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
            <IonTitle>Franca-SP e Região</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <ChurchesFilterModal showModal={this.state.showModal} filters={this.state.filters} search={this.search}></ChurchesFilterModal>
          <IonLoading isOpen={this.state.loading}></IonLoading>
          <IonList lines="none">
            {this.createListItems()}
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(withIonLifeCycle(Churches));
