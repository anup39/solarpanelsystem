import {findSolarConfig} from './utils';

const  calculateYearlyEnergy = (solarPanelConfigs : [], panelCapacityWatts:number, panelCapcity:number ,panelCount:number) => {
    const  monthlyAverageEnergyBillInput = 300;
    const  energyCostPerKwhInput = 0.31;
    const  dcToAcDerateInput = 0.85;
    const  panelCapacityWattsInput = panelCapcity;
    const yearlyKwhEnergyConsumption = (monthlyAverageEnergyBillInput / energyCostPerKwhInput) * 12;
    const defaultPanelCapacity = panelCapacityWatts;
    const panelCapacityRatio = panelCapacityWattsInput / defaultPanelCapacity;

    const configId = findSolarConfig(
        solarPanelConfigs,
        yearlyKwhEnergyConsumption,
        panelCapacityRatio,
        dcToAcDerateInput,
      );

    const  panelConfig = solarPanelConfigs[configId];
    const  yearlyEnergyDcKwh = panelConfig.yearlyEnergyDcKwh;
    const energy  = yearlyEnergyDcKwh * panelCount;
    return energy;
}

export default calculateYearlyEnergy
