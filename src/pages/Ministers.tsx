import React, { useState, useEffect } from 'react';
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
  IonLoading,
  IonSearchbar,
  useIonViewWillEnter
} from '@ionic/react';
import { getDatabase, ref, onValue } from "firebase/database";
import MinisterDetails from './MinisterDetails';
import { useParams } from 'react-router-dom';

const Ministers: React.FC = () => {
  const [ministers, setMinisters] = useState<{ [key: string]: any }>({});
  const [ministersShown, setMinistersShown] = useState<{ [key: string]: any }>({});
  const [details, setDetails] = useState<{ [key: string]: any }>({});
  const [actives, setActives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { section } = useParams<{ section: string }>()

  useIonViewWillEnter(() => {
    loadVolunteers(section);
  });

  const loadVolunteers = (section: string) => {
    let ministersData: { [key: string]: any } = {};
    const db = getDatabase();
    const sectionRef = ref(db, `/lista-telefones/${section}`);
    onValue(sectionRef, (snapshot) => {
      snapshot.forEach((cargo: any) => {
        if (cargo.key !== 'descricao' && cargo.key !== 'order') {
          ministersData[cargo.key] = { 
            'descricao': cargo.val()['descricao'], 
            'voluntarios': [], 
            'order': cargo.val()['order'] ? parseInt(cargo.val()['order']) : Number.MAX_SAFE_INTEGER 
          };
          cargo.forEach((voluntary: any) => {
            if (voluntary.val() !== cargo.val()['descricao'] && voluntary.val() !== cargo.val()['order']) {
              ministersData[cargo.key]['voluntarios'].push(voluntary);
            }
          });
        }
      });

      ministersData = Object.fromEntries(
        Object.entries(ministersData).sort(([,a],[,b]) => { 
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return a.descricao.localeCompare(b.descricao);
        })
      );

      setMinisters(ministersData);
      setMinistersShown(ministersData);
      setLoading(false);
    });
  };

  const closeMinisterDetails = () => {
    setOpen(false);
  };

  const setActivesHandler = (cargo: string) => {
    setActives((prevActives) => {
      if (prevActives.includes(cargo)) {
        return prevActives.filter((active) => active !== cargo);
      } else {
        return [...prevActives, cargo];
      }
    });
  };

  const createList = () => {
    let html = []
    let ministersFiltered = ministersShown;
    for (let key in ministersFiltered) {
      html.push(
        <IonItemGroup key={key}>
          <IonItemDivider onClick={() => setActivesHandler(key)}>
            <IonLabel>{ministersFiltered[key]["descricao"]}</IonLabel>
          </IonItemDivider>
          {createListItems(ministersFiltered[key]["voluntarios"], key)}
        </IonItemGroup>
      )
    }
    return html;
  };

  const createListItems = (voluntarios: any, key: string) => {
    const style = !actives.includes(key) ? { display: 'None' } : { display: 'inherit' };

    voluntarios.sort((a: any, b: any) => {
      const orderA = a.val()['order'] ? parseInt(a.val()['order']) : Number.MAX_SAFE_INTEGER;
      const orderB = b.val()['order'] ? parseInt(b.val()['order']) : Number.MAX_SAFE_INTEGER;
      if (orderA > orderB) return 1;
      if (orderA < orderB) return -1;
      return a.val()['nome'].localeCompare(b.val()['nome']);
    });

    return voluntarios.map((x: any) => (
      <IonItem key={x.key} style={style} onClick={() => {setOpen(true); setDetails(x.val())}}>
        <IonLabel>{x.val()['nome']}</IonLabel>
      </IonItem>
    ));
  };

  const search = (input: any) => {
    setLoading(true);
    const searchValue = input.detail.value.toLowerCase();
    let filteredMinisters: { [key: string]: any } = {};

    for (let cargo in ministers) {
      if (!filteredMinisters[cargo]){
        filteredMinisters[cargo] = {
          'descricao': ministers[cargo]['descricao'], 
          'order': ministers[cargo]['order']
        };
      }
      filteredMinisters[cargo]['voluntarios'] = ministers[cargo]['voluntarios'].filter((x: any) =>
        x.val().nome.toLowerCase().includes(searchValue)
      );
    }

    setMinistersShown(filteredMinisters);
    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista Telefônica</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} />
        <MinisterDetails open={open} details={details} close={closeMinisterDetails} />
        <IonSearchbar placeholder="Busque por nome" onIonInput={search} />
        <IonList>{createList()}</IonList>
      </IonContent>
    </IonPage>
  );
};

export default Ministers;
