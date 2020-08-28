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
  close: Function,
};

class MinisterDetails extends React.Component<State, {}> {

  render() {
    return (
        <IonModal
        isOpen={this.props.open}
        cssClass='my-custom-class'            
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{this.props.details.nome}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.props.details.hasOwnProperty("telefone1") &&
            <IonItem>
                Telefone 1: {this.props.details.telefone1}
            </IonItem>
          }
          
          {this.props.details.hasOwnProperty("telefone2") &&
            <IonItem>
                Telefone 2: {this.props.details.telefone2}
            </IonItem>
          }

          {this.props.details.hasOwnProperty("comum") &&
            <IonItem>
                Comum Congregação: {this.props.details.comum}
            </IonItem>
          }
          
          {this.props.details.hasOwnProperty("email") &&
            <IonItem>
                Email: {this.props.details.email}
            </IonItem>
          }

          <IonGrid>
            <IonRow>
              <IonCol size="12"><IonButton expand="block" onClick={() => this.props.close()}>Fechar</IonButton></IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
};

export default MinisterDetails;
