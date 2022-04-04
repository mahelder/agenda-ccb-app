import {
  IonContent,
  IonItem,
  IonList,
  IonCheckbox,
  IonLabel,
  IonButton,
  IonSearchbar,
  IonModal,
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItemGroup,
  IonItemDivider
} from '@ionic/react';
import React from 'react';

type State = {
  filters: { [index: string]: any },
  showModal: boolean,
  errors: string,
  search: any
};

const days = {
  "2N": "Segunda-feira",
  "3T": "Terça-feira (tarde)",
  "3N": "Terça-feira",
  "4N": "Quarta-feira",
  "5T": "Quinta-feira (tarde)",
  "5N": "Quinta-feira",
  "6N": "Sexta-feira",
  "SN": "Sábado",
  "DN": "Domingo",
  "RJM-DM": "Domingo (manhã)"
} as {
  [key: string]: string
}

class ChurchesFilterModal extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      filters: {
        events: []
      },
      errors: "",
      showModal: props.showModal,
      search: null
    }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      showModal: nextProps.showModal,
      filters: nextProps.filters,
      search: nextProps.search
    });
  }

  search(input: any) {
    let filters = this.state.filters;
    let search = input.detail.value.toLowerCase();
    filters.search = search
    this.setState({ filters });
  }

  changeCheck(event: any) {
    let filters = this.state.filters;
    let days = this.state.filters.days ? this.state.filters.days : [];
    let checkbox = event.detail;
    if (checkbox.checked) {
      days.push(checkbox.value)
    } else {
      let index = days.indexOf(checkbox.value);
      if (index > -1) {
        days.splice(index, 1);
      }
    }
    filters.days = days
    this.setState({ filters });

  }

  changeEvent(event: any) {
    let filters = this.state.filters;
    let events = this.state.filters.events ? this.state.filters.events : [];
    let checkbox = event.detail;
    if (checkbox.checked) {
      events.push(checkbox.value)
    } else {
      let index = events.indexOf(checkbox.value);
      if (index > -1) {
        events.splice(index, 1);
      }
    }
    filters.events = events
    this.setState({ filters });

  }

  createListDays() {
    let html = []
    let filters = this.state.filters.days ? this.state.filters.days : [];
    for (let day in days) {
      html.push(
        <IonItem key={day}>
          <IonLabel>{days[day]}</IonLabel>
          <IonCheckbox slot="end" value={day} checked={filters.includes(day)} onIonChange={(e) => this.changeCheck(e)} />
        </IonItem>
      );
    }
    return html;
  }

  filter() {
    let search = this.state.search;
    let filters = this.state.filters;
    filters.days = (filters.days) ? filters.days : []
    if (filters.days.length > 0 && filters.events.length === 0) {
      this.setState({ errors: "Selecione cultos ou ensaios." })
    }
    else {
      this.setState({ errors: "" })
      search(filters);
    }
  }

  clearFilters() {
    let filters = { events: [] };
    this.setState({ filters, errors: "" })
  }

  render() {
    return (
      <IonModal isOpen={this.state.showModal}>
        <IonContent>
          <IonSearchbar placeholder="Busque por bairro" onIonChange={(e) => this.search(e)} value={this.state.filters.search}></IonSearchbar>
          <IonList>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Eventos</IonLabel>
              </IonItemDivider>
              <IonItem>
                <IonLabel>Cultos</IonLabel>
                <IonCheckbox slot="end" value="cults" checked={this.state.filters.events.includes('cults')} onIonChange={(e) => this.changeEvent(e)} />
              </IonItem>
              <IonItem>
                <IonLabel>Ensaios</IonLabel>
                <IonCheckbox slot="end" value="rehearsals" checked={this.state.filters.events.includes('rehearsals')} onIonChange={(e) => this.changeEvent(e)} />
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Dias de culto ou ensaio</IonLabel>
              </IonItemDivider>
              {this.createListDays()}
            </IonItemGroup>

          </IonList>
          <IonGrid>
            {this.state.errors.length > 0 &&
              <IonRow>
                <IonText color="danger">{this.state.errors}</IonText>
              </IonRow>
            }
            <IonRow>
              <IonCol size="6"><IonButton onClick={() => this.filter()}>Aplicar filtros</IonButton></IonCol>
              <IonCol size="6"><IonButton color="danger" onClick={() => this.clearFilters()}>Limpar filtros</IonButton></IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
};

export default withIonLifeCycle(ChurchesFilterModal);
