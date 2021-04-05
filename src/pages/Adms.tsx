import React from 'react';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRadioGroup,
    IonRadio,
    IonToast,
    IonPage,
    withIonLifeCycle
} from '@ionic/react';
import firebase from 'firebase';
import { withRouter } from 'react-router';

type State = {
    adms: any[],
    loading: boolean,
    selected: string,
    showToast: boolean,
};

class Adms extends React.Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            adms: [],
            loading: false,
            selected: window.localStorage['adm'] ? window.localStorage['adm'] : "franca",
            showToast: false,
        }
    }

    ionViewWillEnter() {
        this.loadAdms();
    }

    loadAdms() {
        var adms: any[] = [];
        firebase.database().ref(`/regionais/ribeirao-preto/administracoes`).on('value', (ref) => {
            ref.forEach((adm: any) => {
                adms.push({ key: adm.key, value: adm.val() })
            });

            adms.sort(function (a, b) {
                return a.value.localeCompare(b.value);
            });

            if (window.localStorage['adm'] === undefined && window.localStorage['adm'] === null){
                window.localStorage['adm'] = adms[0].key;
                window.localStorage['adm:description'] = adms[0].value;
            }

            this.setState({ adms, loading: false });
        });

    }

    setSelected(value: string) {
        if (value !== undefined){
            this.setState({selected: value});
            let selectedAdm = this.state.adms.filter(x => x.key === value);
            window.localStorage['adm'] = value;
            window.localStorage['adm:description'] = selectedAdm[0].value
        }
    }

    setShowToast(status: boolean) {
        this.setState({showToast: status});
    }

    createItems() {
        let adms = this.state.adms;

        let itemsAdms = adms.map((x) =>
            <IonItem key={x.key}>
                <IonLabel>{x.value}</IonLabel>
                <IonRadio slot="start" value={x.key} />
            </IonItem>
        );

        return itemsAdms;
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Selecione uma administração</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    <IonList>
                        <IonRadioGroup value={this.state.selected} onIonChange={e => this.setSelected(e.detail.value)}>
                            <IonListHeader>
                                <IonLabel>Administrações</IonLabel>
                            </IonListHeader>

                            {this.createItems()}
                        </IonRadioGroup>
                    </IonList>

                    <IonToast
                        isOpen={this.state.showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message="Selecione uma administração."
                        duration={1000}
                    />
                </IonContent>
            </IonPage>
        );
    }
};

export default withRouter(withIonLifeCycle(Adms));
