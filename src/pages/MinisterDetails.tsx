import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonModal,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';

type State = {
  details: { [index: string]: any },
  open: boolean,
};

class MinisterDetails extends React.Component<State, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      open: props.open,
      details: props.details
    }
  }

  componentWillReceiveProps(nextProps: any){
    this.setState({open: nextProps.open, details: nextProps.details})
  }  

  render() {
    return (
        <IonModal
        isOpen={this.state.open}
        cssClass='my-custom-class'            
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{this.state.details.nome}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.state.details.hasOwnProperty("telefone1") &&
            <IonItem>
                Telefone 1: {this.state.details.telefone1}
            </IonItem>
          }
          
          {this.state.details.hasOwnProperty("telefone2") &&
            <IonItem>
                Telefone 2: {this.state.details.telefone2}
            </IonItem>
          }

          {this.state.details.hasOwnProperty("comum") &&
            <IonItem>
                Comum Congregação: {this.state.details.comum}
            </IonItem>
          }
          
          {this.state.details.hasOwnProperty("email") &&
            <IonItem>
                Email: {this.state.details.email}
            </IonItem>
          }

          <IonGrid>
            <IonRow>
              <IonCol size="12"><IonButton expand="block" onClick={() => this.setState({open: false})}>Fechar</IonButton></IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
};

export default MinisterDetails;
