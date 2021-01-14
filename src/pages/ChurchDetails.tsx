import React from 'react';
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonImg,
  IonCard,
  IonLoading,
  withIonLifeCycle
} from '@ionic/react';
import './ChurchesDetails.css';
import firebase from 'firebase';
import MinisterDetails from './MinisterDetails';


type State = {
  church: { [index: string]: any },
  ministers: any[],
  musicMinisters: any[],
  loading: boolean,
  id: string,
  details: { [index: string]: any },
  open: boolean,
};

const ministersPtBr = {
  "anciaes": {"descricao": "Ancião", "secao": "ministerio"},
  "diaconos": {"descricao": "Diácono", "secao": "ministerio"},
  "cooperadores-franca": {"descricao": "Cooperador", "secao": "ministerio"},
  "cooperadores-regiao": {"descricao": "Cooperador", "secao": "ministerio"},
  "cooperadores-rjm-franca": {"descricao": "Cooperador RJM", "secao": "ministerio"},
  "cooperadores-rjm-regiao": {"descricao": "Cooperador RJM", "secao": "ministerio"},
  "encarregados-regionais": {"descricao": "Encarregado Regional", "secao": "musica"},
  "encarregados-locais-franca": {"descricao": "Encarregado Local", "secao": "musica"},
  "encarregados-locais-regiao": {"descricao": "Encarregado Local", "secao": "musica"},
  "examinadoras": {"descricao": "Examinadora", "secao": "musica"}
} as {
  [key: string]: any
}

class ChurchDetails extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      church: {},
      ministers: [],
      musicMinisters: [],
      loading: true,
      id: props.match.params.id,
      details: {},
      open: false,
    }
    this.closeMinisterDetails = this.closeMinisterDetails.bind(this);
  }

  async ionViewWillEnter() {
    await this.loadChurch(this.state.id);
    this.loadMinisters();
  }

  closeMinisterDetails() {
    this.setState({open: false});
  }

  async loadChurch(key: string) {
    let church = await firebase.database().ref(`/churches/${key}`).once('value');
    let churchDetail = church.val();
    this.setState({ church: churchDetail, loading: false });
  }

  async loadMinisters() {
    let church = this.state.church;
    let ministers = this.state.ministers;
    let musicMinisters = this.state.musicMinisters;
    let ref = await firebase.database().ref(`/lista-telefones`).once('value');
    let keys = ["anciaes", "diaconos", "cooperadores-franca", "cooperadores-regiao", "cooperadores-rjm-franca", "cooperadores-rjm-regiao", "encarregados-locais-franca", "encarregados-locais-regiao", "encarregados-regionais", "examinadoras"];
    keys.forEach(key => {
      let childs = ref.val()[ministersPtBr[key]["secao"]][key];
      for (let i in childs) {
        if (
            (church.place !== "Franca - SP" && childs[i]["comum"] === `${church.name} / ${church.place}` || (childs[i]["outrasComuns"] !== undefined && childs[i]["outrasComuns"].includes(`${church.name} / ${church.place}`))) ||
            (childs[i]["comum"] === church.name || (childs[i]["outrasComuns"] !== undefined && childs[i]["outrasComuns"].includes(church.name)))
        ) {
          let obj = childs[i];
          obj["type"] = ministersPtBr[key]["descricao"];
          
          if (ministersPtBr[key]["secao"] === "ministerio")
            ministers.push(obj);
          else
            musicMinisters.push(obj);
        }
      }
    });

    this.setState({ ministers, musicMinisters });
  }

  createListMinisters(ministers: any) {    
    let html = [];
    for (let index in ministers) {
      html.push(
        <IonItem key={index} onClick={() => this.setState({open: true, details: ministers[index]})}>
          <IonLabel><small>{ministers[index].type}:</small> {ministers[index].nome}</IonLabel>          
        </IonItem>
      );
    }
    return html;
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{this.state.church.place} - {this.state.church.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading}></IonLoading>
          <MinisterDetails open={this.state.open} details={this.state.details} close={this.closeMinisterDetails}/>
          <IonList lines="none">
            <IonItem>
              <IonCard>
                <IonImg className="img-details" src={this.state.church.imgUrl} />
              </IonCard>
            </IonItem>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Serviços</IonLabel>
              </IonItemDivider>

              <IonItem>
                <p>Cultos: {this.state.church.cults}</p>
              </IonItem>

              <IonItem>
                <p>Ensaios: {(this.state.church.rehearsals) ? this.state.church.rehearsals.description : null}</p>
              </IonItem>

              <IonItem href={this.state.church.location} target="_blank">
                <p>Como chegar?</p>
              </IonItem>

            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Ministério Local</IonLabel>
              </IonItemDivider>

              {this.createListMinisters(this.state.ministers)}

            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Ministério Musical</IonLabel>
              </IonItemDivider>

              {this.createListMinisters(this.state.musicMinisters)}

            </IonItemGroup>
          </IonList>

        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(ChurchDetails);
