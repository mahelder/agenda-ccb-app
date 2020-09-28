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
  withIonLifeCycle,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonLoading
} from '@ionic/react';
import firebase from 'firebase';
import moment from 'moment';
import './Agendas.css';

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const monthsPtBr = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

type State = {
  agendas: { [index: string]: any },
  activeMonths: any[],
  loading: boolean,
  details: { [index: string]: any },
  open: boolean,
};

class Agendas extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeMonths: [monthsPtBr[new Date().getMonth()]],
      agendas: {},
      loading: true,
      details: {},
      open: false,
    }
    this.createListItems = this.createListItems.bind(this);
  }

  ionViewWillEnter() {
    this.loadAgendas();
  }

  loadAgendas() {
    firebase.database().ref(`/agendas/ministeriais`).on('value', (agendas) => this.addListAgendas(agendas));
  }

  addListAgendas(entity: any) {
    let agendas = this.state.agendas;
    entity.forEach((element: any) => {
      agendas[element.key] = element.val()
    });

    this.setState({ agendas, loading: false });
  }

  setActiveMonths(month: string, _this: any) {
    let activeMonths = _this.state.activeMonths
    if (activeMonths.includes(month)) {
      let index = activeMonths.indexOf(month);
      if (index > -1) {
        activeMonths.splice(index, 1);
      }
    } else {
      activeMonths.push(month)
    }
    _this.setState({ activeMonths })
  }

  createListGroups() {

    let html: any[] = [];
    var createListItems = this.createListItems;
    var setActiveMonths = this.setActiveMonths;
    var _this = this;
    months.forEach(function (month, index) {
      html.push(
        <IonItemGroup key={index}>
          <IonItemDivider onClick={() => setActiveMonths(month, _this)}>
            <IonLabel className="capitalize">{monthsPtBr[index]}</IonLabel>
          </IonItemDivider>
          {createListItems(month)}
        </IonItemGroup>
      );
    });
    return html;

  }

  createListItems(month: string) {
    let html: any[] = [];
    let agendas = this.state.agendas;
    for (let agenda in agendas[month]) {
      if (agenda !== "description"){
        let diff = moment(agendas[month][agenda].date).diff(moment(), 'days')
        let color = ((diff > -1) && (diff < 4)) ? "danger" : "";
        html.push(
          <IonItem 
            key={agenda} 
            style={(!this.state.activeMonths.includes(month)) ? { "display": 'None' } : { "display": 'inherit' }}
            onClick={() => this.setState({open: true, details: agendas[month][agenda]})}  
          >
            <IonLabel color={color}>
              {moment(agendas[month][agenda].date).format("DD/MM/YYYY")} - {agendas[month][agenda].time} - {agendas[month][agenda].name}
            </IonLabel>
          </IonItem>
        );
      }
      
    }
    return html;
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Calendário 2020</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading}></IonLoading>
          <IonModal
            isOpen={this.state.open}
            cssClass='my-custom-class'
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>{this.state.details.name}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonItem>
                Data e Horário: {moment(this.state.details.date).format("DD/MM/YYYY")} {this.state.details.time}
              </IonItem>
              <IonItem>
                Local: {this.state.details.place}
              </IonItem>
              <IonItem>
                Detalhes: {this.state.details.description}
              </IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol size="12"><IonButton expand="block" onClick={() => this.setState({ open: false })}>Fechar</IonButton></IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonModal>
          <IonList lines="none">
            {this.createListGroups()}
          </IonList>
        </IonContent>
      </IonPage >
    );
  }
};

export default withIonLifeCycle(Agendas);
