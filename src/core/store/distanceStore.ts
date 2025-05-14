import create from "zustand";

interface transportItem{
  id: string | number,
  distance: number, 
  typeTransport : "express" | "normal",
  money: number,

}

interface transportState {
  transport: transportItem[],
  addTransport:(transportt: transportItem) => void,
  moneyToDistance: (id : string | number) => void,
}
export const useDistanceStore = create<transportState>((set, get) => ({
  transport: [],
  addTransport: (transportt) => {
    const currentTransport = get().transport;
    const exist = currentTransport.find(item => item.id === transportt.id)
    if(!exist){
      set({ transport: [...currentTransport, {...transportt, money: 0}]})
    }
    else if (exist) {
      // Update giá trị mới
      const updated = currentTransport.map(item =>
        item.id === transportt.id ? { ...transportt, money: 0 } : item
      );
      set({ transport: updated });
    }
    
  },
  moneyToDistance: (id) => {
    const currentTransport = get().transport;
    const exist = currentTransport.find(item => item.id === id);

    if (!exist) return;

    let updatedMoney = 0;

    if (exist.typeTransport === "express") {
      if (exist.distance < 1000) updatedMoney = 20000 + 10 * exist.distance;
      else if (exist.distance < 5000) updatedMoney = 18000 + 8 * exist.distance;
      else if (exist.distance < 10000) updatedMoney =6 * exist.distance;
      else if (exist.distance < 100000) updatedMoney = 5 * exist.distance;
      else updatedMoney = 5000 + 4 * 1000;
    } else if (exist.typeTransport === "normal") {
      if (exist.distance < 1000) updatedMoney = 5000 + 8 * exist.distance;
      else if (exist.distance < 5000) updatedMoney =3000 + 7 * exist.distance;
      else if (exist.distance < 10000) updatedMoney =  5 * exist.distance;
      else if (exist.distance < 100000) updatedMoney = 4 * exist.distance;
      else updatedMoney = 5000 + 3 * 1000;
    }

    const updated = currentTransport.map(item =>
      item.id === id ? { ...item, money: updatedMoney } : item
    );

    set({ transport: updated });
  }
}))