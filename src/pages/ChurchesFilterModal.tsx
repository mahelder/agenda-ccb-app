import {
    IonContent,
    IonItem,
    IonList,
    IonCheckbox,
    IonLabel,
    IonButton,
    IonSearchbar,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonItemGroup,
    IonItemDivider
  } from '@ionic/react';
  import { useState, useEffect, useCallback } from 'react';

  type MyObject = {
    [key: string]: string;
  };
  
  const days: MyObject = {
    "2N": "Segunda-feira",
    "3T": "Terça-feira (tarde)",
    "3N": "Terça-feira",
    "4N": "Quarta-feira",
    "5T": "Quinta-feira (tarde)",
    "5N": "Quinta-feira",
    "6N": "Sexta-feira",
    "SN": "Sábado",
    "DN": "Domingo",
    "RJM-DM": "RJM Domingo (manhã)",
    "RJM-DT": "RJM Domingo (tarde)",
    "RJM-SN": "RJM Sábado",
    "RJM-6N": "RJM Sexta-feira"
  };
  
  const ChurchesFilterModal: React.FC<{
    showModal: boolean;
    filters: { events: string[], days: string[], search: string };
    search: (filters: { events: string[], days: string[], search: string }) => void;
  }> = ({ showModal, filters, search }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [errors, setErrors] = useState("");
    
    useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);
  
    const searchHandler = (e: any) => {
      const search = e.detail.value.toLowerCase();
      let filters = localFilters;
      filters.search = search
      setLocalFilters(filters);
    };
  
    const changeCheck = (event: any) => {
        let filters = localFilters;
        let days = localFilters.days ? localFilters.days : [];
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
        setLocalFilters(filters)
    };
  
    const changeEvent = (event: any) => {
      let filters = localFilters;
      let events = localFilters.events ? localFilters.events : [];
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
      setLocalFilters(filters);
    };
  
    const createListDays = () => {
      return Object.keys(days).map((day) => (
        <IonItem key={day}>
          <IonLabel>{days[day]}</IonLabel>
          <IonCheckbox
            slot="end"
            value={day}
            checked={localFilters.days?.includes(day)}
            onIonChange={changeCheck}
          />
        </IonItem>
      ));
    };
  
    const filter = () => {
      const { events, days } = localFilters;
      if (days.length > 0 && events.length === 0) {
        setErrors("Selecione cultos ou ensaios.");
      } else {
        setErrors("");
        search(localFilters);
      }
    };
  
    const clearFilters = () => {
      setLocalFilters({ events: [], days: [], search: "" });
      setErrors("");
    };
  
    return (
      <IonModal isOpen={showModal}>
        <IonContent>
          <IonSearchbar
            placeholder="Busque por bairro"
            onIonChange={searchHandler}
            value={localFilters.search}
          />
          <IonList>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Eventos</IonLabel>
              </IonItemDivider>
              <IonItem>
                <IonLabel>Cultos</IonLabel>
                <IonCheckbox
                  slot="end"
                  value="cults"
                  checked={localFilters.events.includes('cults')}
                  onIonChange={changeEvent}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Ensaios</IonLabel>
                <IonCheckbox
                  slot="end"
                  value="rehearsals"
                  checked={localFilters.events.includes('rehearsals')}
                  onIonChange={changeEvent}
                />
              </IonItem>
            </IonItemGroup>
  
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Dias de culto ou ensaio</IonLabel>
              </IonItemDivider>
              {createListDays()}
            </IonItemGroup>
          </IonList>
          <IonGrid>
            {errors.length > 0 && (
              <IonRow>
                <IonText color="danger">{errors}</IonText>
              </IonRow>
            )}
            <IonRow>
              <IonCol size="6">
                <IonButton onClick={filter}>Aplicar filtros</IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton color="danger" onClick={clearFilters}>
                  Limpar filtros
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  };
  
  export default ChurchesFilterModal;
  