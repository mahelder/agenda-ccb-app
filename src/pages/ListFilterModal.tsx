import {
  IonContent,
  IonItem,
  IonList,
  IonCheckbox,
  IonLabel,
  IonButton,
  IonModal,
  withIonLifeCycle,
  IonGrid,
  IonRow,
  IonCol,
  IonItemGroup,
  IonItemDivider
} from '@ionic/react';
import React from 'react';

type Props = {
  search: Function
};

type State = {
  filters: any[],
  showModal: boolean,
  search: any
};

let services = [
  "Batismo",
  "Santa-Ceia",
  "Reunião da Mocidade",
  "Reunião da Piedade",
  "Ensaio Regional",
];

class ListFilterModal extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      filters: [],
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

  changeCheck(event: any) {
    let filters = this.state.filters;
    let checkbox = event.detail;
    if (checkbox.checked) {
      filters.push(checkbox.value)
    } else {
      let index = filters.indexOf(checkbox.value);
      if (index > -1) {
        filters.splice(index, 1);
      }
    }
    this.setState({ filters });

  }

  createListEvents() {
    let filters = this.state.filters;
    return services.map(service => 
      <IonItem key={service}>
        <IonLabel>{service}</IonLabel>
        <IonCheckbox slot="end" value={service} checked={filters.includes(service)} onIonChange={(e) => this.changeCheck(e)} />
      </IonItem>
    );
  }

  clearFilters() {
    let filters: any[] = [];
    this.setState({ filters })
  }

  render() {
    return (
      <IonModal isOpen={this.state.showModal}>
        <IonContent>
          <IonList>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Eventos</IonLabel>
              </IonItemDivider>
              {this.createListEvents()}
            </IonItemGroup>

          </IonList>
          <IonGrid>
            <IonRow>
              <IonCol size="6"><IonButton onClick={() => this.props.search(this.state.filters)}>Aplicar filtros</IonButton></IonCol>
              <IonCol size="6"><IonButton color="danger" onClick={() => this.clearFilters()}>Limpar filtros</IonButton></IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
};

export default withIonLifeCycle(ListFilterModal);
