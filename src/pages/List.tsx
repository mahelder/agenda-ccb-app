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
  IonLoading,
  IonIcon
} from '@ionic/react';
import firebase from 'firebase';
import moment from 'moment';
import './List.css';
import { search } from 'ionicons/icons';
import ListFilterModal from './ListFilterModal';

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const monthsPtBr = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

type State = {
  agendas: { [index: string]: any },
  servicesShown: { [index: string]: any },
  activeMonths: any[],
  loading: boolean,
  showModal: boolean,
  details: { [index: string]: any },
  filters: any[],
  open: boolean,
  selectedAdm: string,
  selectedAdmDescription: string,
};

class List extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeMonths: [months[new Date().getMonth()]],
      agendas: {},
      servicesShown: {},
      loading: true,
      showModal: false,
      details: {},
      filters: [],
      open: false,
      selectedAdm: window.localStorage['adm'] ? window.localStorage['adm'] : "franca",
      selectedAdmDescription: window.localStorage['adm:description'] ? window.localStorage['adm:description'] : "Franca",
    }
    this.createListItems = this.createListItems.bind(this);
    this.search = this.search.bind(this);
  }

  ionViewWillEnter() {
    this.loadAgendas();
  }

  showModal() {
    this.setState({ showModal: true });
  }

  loadAgendas() {
    firebase.database().ref(`/regionais/ribeirao-preto/dados/lista`).on('value', (agendas) => this.addListAgendas(agendas));
  }

  search(filters: any) {
    this.setState({ filters, showModal: false });
  }

  addListAgendas(entity: any) {
    let agendas = this.state.agendas;
    entity.forEach((element: any) => {
      agendas[element.key] = element.val()
    });

    this.setState({ agendas, servicesShown: agendas, loading: false });
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
    let filters = this.state.filters;
    let monthAgendas = [];
    
    for(let agenda in agendas[month]){
      if(agenda !== "description") {        
        if (filters.length === 0){
          monthAgendas.push(agendas[month][agenda])
        }

        if(filters.length > 0 && filters.includes(agendas[month][agenda]["service"])){
          monthAgendas.push(agendas[month][agenda])
        } 
      }
    }

    monthAgendas.sort(function(a,b) {
      return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)
    });

    monthAgendas.forEach((agenda, index) => {
      let diff = moment(agenda.date).diff(moment(), 'days')
      let color = ((diff > -1) && (diff < 4)) ? "danger" : "";
      html.push(
        <IonItem 
          key={index} 
          style={(!this.state.activeMonths.includes(month)) ? { "display": 'None' } : { "display": 'inherit' }}
          onClick={() => this.setState({open: true, details: agenda})}  
        >
          <IonLabel color={color}>
            {moment(agenda.date).format("DD/MM/YYYY")} - {agenda.time} - {agenda.service} - {agenda.place}
          </IonLabel>
        </IonItem>
      );
    });

    return html;
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista de Serviços {moment().year()}</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => this.showModal()}>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading}></IonLoading>
          <ListFilterModal showModal={this.state.showModal} filters={this.state.filters} search={this.search}></ListFilterModal>
          <IonModal
            isOpen={this.state.open}
            cssClass='my-custom-class'
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Detalhes do Serviço</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonItem>
                Título: {this.state.details.service}
              </IonItem>
              <IonItem>
                Responsável: {this.state.details.name}
              </IonItem>
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

export default withIonLifeCycle(List);
