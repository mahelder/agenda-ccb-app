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
  const [listKeys, setListKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { section } = useParams<{ section: string }>()

  useIonViewWillEnter(() => {
    loadVolunteers(section);
  });

  const loadVolunteers = (section: string) => {
    const ministersData: { [key: string]: any } = {};
    const listKeysData: any[] = [];

    const db = getDatabase();
    const sectionRef = ref(db, `/lista-telefones/${section}`);
    onValue(sectionRef, (snapshot) => {
      snapshot.forEach((cargo: any) => {
        if (cargo.key !== 'descricao' && cargo.key !== 'order') {
          ministersData[cargo.key] = { descricao: cargo.val()['descricao'], voluntarios: [] };
          listKeysData.push({
            descricao: cargo.val()['descricao'],
            key: cargo.key,
            order: cargo.val()['order'] ? parseInt(cargo.val()['order']) : Number.MAX_SAFE_INTEGER,
          });

          cargo.forEach((voluntary: any) => {
            if (voluntary.val() !== cargo.val()['descricao'] && voluntary.val() !== cargo.val()['order']) {
              ministersData[cargo.key]['voluntarios'].push(voluntary);
            }
          });
        }
      });

      listKeysData.sort((a, b) => {
        if (a.order > b.order) return 1;
        if (a.order < b.order) return -1;
        return a.descricao.localeCompare(b.descricao);
      });

      setMinisters(ministersData);
      setMinistersShown(ministersData);
      setListKeys(listKeysData);
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
    return listKeys.map((x) => {
      if (ministers[x.key] !== undefined) {
        return (
          <IonItemGroup key={x.key}>
            <IonItemDivider onClick={() => setActivesHandler(x.key)}>
              <IonLabel>{ministers[x.key]['descricao']}</IonLabel>
            </IonItemDivider>
            {createListItems(ministers[x.key]['voluntarios'], x.key)}
          </IonItemGroup>
        );
      }
    });
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
    const filteredMinisters = { ...ministers };

    for (let cargo in filteredMinisters) {
      filteredMinisters[cargo]['voluntarios'] = filteredMinisters[cargo]['voluntarios'].filter((x: any) =>
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
        <IonSearchbar placeholder="Busque por nome" onIonChange={search} />
        <IonList>{createList()}</IonList>
      </IonContent>
    </IonPage>
  );
};

export default Ministers;
