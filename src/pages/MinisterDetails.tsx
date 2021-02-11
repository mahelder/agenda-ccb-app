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
  IonLabel
} from '@ionic/react';

type State = {
  details: { [index: string]: any },
  open: boolean,
  close: Function,
};

class MinisterDetails extends React.Component<State, {}> {

  createLinkPhone(phone: any) {
    let newPhone = phone ? phone : "";
    newPhone = newPhone.split("/");

    let links = newPhone.map((fone: any) => 
      <a style={{marginRight: 10, color: "black"}} href={`tel:${fone.trim()}`}>{fone.trim()}</a>
    );

    return links;
  }

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
                <IonLabel>Telefone 1: {this.createLinkPhone(this.props.details.telefone1)}</IonLabel>                
            </IonItem>
          }
          
          {this.props.details.hasOwnProperty("telefone2") &&
            <IonItem>
                <IonLabel>Telefone 2: {this.createLinkPhone(this.props.details.telefone2)}</IonLabel>
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

          {this.props.details.hasOwnProperty("cargo") &&
            <IonItem>
                Cargo: {this.props.details.cargo}
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
