import React from 'react';
import {
  IonBackButton,
  IonButtons,
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
  IonSpinner,
  IonLoading,
  withIonLifeCycle
} from '@ionic/react';
import './ChurchesDetails.css';
import firebase from 'firebase';
import MinisterDetails from './MinisterDetails';


type State = {
  church: { [index: string]: any },
  ministers: any[],
  loading: boolean,
  id: string,
  details: { [index: string]: any },
  open: boolean,
};

const ministersPtBr = {
  "anciaes": "Ancião",
  "diaconos": "Diácono",
  "cooperadores-franca": "Cooperador",
  "cooperadores-regiao": "Cooperador",
  "cooperadores-rjm-franca": "Cooperador RJM",
  "cooperadores-rjm-regiao": "Cooperador RJM",
  "encarregados-regionais": "Encarregado Regional",
  "encarregados-locais-franca": "Encarregado Local",
  "encarregados-locais-regiao": "Encarregado Local",
  "examinadoras": "Examinadora"
} as {
  [key: string]: string
}

class ChurchDetails extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      church: {},
      ministers: [],
      loading: true,
      id: props.match.params.id,
      details: {},
      open: false,
    }
  }

  async ionViewWillEnter() {
    await this.loadChurch(this.state.id);
    this.loadMinisters();
  }

  async loadChurch(key: string) {
    let church = await firebase.database().ref(`/churches/${key}`).once('value');
    let churchDetail = church.val();
    churchDetail['loadingImg'] = true;
    this.getImage(churchDetail);
    this.setState({ church: churchDetail });
  }

  async loadMinisters() {
    let church = this.state.church;
    let ministers = this.state.ministers;
    console.log(church.name);
    let ref = await firebase.database().ref(`/lista-telefones`).once('value');
    let keys = ["anciaes", "diaconos", "cooperadores-franca", "cooperadores-regiao", "cooperadores-rjm-franca", "cooperadores-rjm-regiao", "encarregados-locais-franca", "encarregados-locais-regiao", "encarregados-regionais", "examinadoras"];
    keys.forEach(key => {
      let childs = ref.val()[key];
      for (let i in childs) {
        if (
          (church.place !== "Franca - SP" && 
          childs[i]["comum"] === `${church.name} / ${church.place}`) ||
          (childs[i]["comum"] === church.name)
        ) {
          let obj = childs[i];
          obj["type"] = ministersPtBr[key];
          ministers.push(obj)
        }
      }
    });

    this.setState({ ministers });
  }

  async getImage(entity: any) {
    let storage = firebase.storage();
    let path = await storage.ref(entity.imgUrl).getDownloadURL();
    let church = this.state.church;
    church['imgUrl'] = path;
    church['loadingImg'] = false;
    this.setState({ church, loading: false });
  }

  createListMinisters() {    
    let html = [];
    let ministers = this.state.ministers;
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
          <MinisterDetails open={this.state.open} details={this.state.details} />
          <IonList lines="none">
            <IonItem>
              <IonCard>
                {this.state.church.loadingImg &&
                  <div className="spin">
                    <IonSpinner />
                  </div>
                }
                {!this.state.church.loadingImg &&
                  <IonImg className="img-details" src={this.state.church.imgUrl} />
                }
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

            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Ministério Local</IonLabel>
              </IonItemDivider>

              {this.createListMinisters()}

            </IonItemGroup>
          </IonList>

        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(ChurchDetails);