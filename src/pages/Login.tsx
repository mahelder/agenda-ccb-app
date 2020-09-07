import {
    IonLabel,
    IonItem,
    IonPage,
    IonLoading,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonInput,
    IonModal,
    withIonLifeCycle,
    IonText
} from '@ionic/react';
import { withRouter, } from 'react-router';
import firebase from 'firebase';
import React from 'react';

type State = {
    email: string,
    password: string,
    loading: boolean,
    errors: string
};

class Login extends React.Component<any, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            password: "",
            errors: ""
        }
    }

    async login() {
        this.setState({ loading: true })
        let { email, password } = this.state;
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            this.setState({ loading: false })
        } catch (error) {
            this.setState({ errors: "Erro de autenticação. Verifique sua conexão, usuário e senha."})
        }        
    }

    render() {
        return (
            <IonModal isOpen={true}>                
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Controle de Acesso</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonLoading isOpen={this.state.loading}></IonLoading>
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput value={this.state.email} type="email" onIonChange={e => this.setState({ email: e.detail.value! })}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Senha</IonLabel>
                            <IonInput value={this.state.password} type="password" onIonChange={e => this.setState({ password: e.detail.value! })}></IonInput>
                        </IonItem>
                        {this.state.errors.length > 0 &&
                        <IonItem>
                            <IonText color="danger">{this.state.errors}</IonText>                            
                        </IonItem>}
                        <div className="ion-padding">
                            <IonButton expand="block" onClick={() => this.login()}>Acessar</IonButton>
                        </div>
                    </IonContent>
                </IonPage>
            </IonModal>
        );
    }
};

export default withRouter(withIonLifeCycle(Login));
