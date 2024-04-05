export class DeliveryData {
    countrySender: string | 'Ukraine';
    regionSender: string;
    citySender: string;
    postDepartmentNumberSender: number;
    countryRecipient: string | 'Ukraine';
    regionRecipient: string;
    cityRecipient: string;
    postDepartmentNumberRecipient: number;
    postDepartmentTypeRecipient: string;
    streetRecipient: string;
    buildingRecipient: string;

    constructor() {
        this.countrySender = 'Ukraine';
        this.regionSender = 'Kyivska';
        this.citySender = 'Kyiv';
        this.countryRecipient = 'Ukraine';
    }

    serialize(): any {
        let data = new Map();

        data.set('COUNTRY_SENDER', this.countrySender);
        data.set('REGION_SENDER', this.regionSender);
        data.set('CITY_SENDER', this.citySender);
        data.set('POST_DEPARTMENT_NUMBER_SENDER', this.postDepartmentNumberSender);
        data.set('COUNTRY_RECIPIENT', this.countryRecipient);
        data.set('REGION_RECIPIENT', this.regionRecipient);
        data.set('CITY_RECIPIENT', this.cityRecipient);
        data.set('POST_DEPARTMENT_NUMBER_RECIPIENT', this.postDepartmentNumberRecipient);
        data.set('POST_DEPARTMENT_TYPE_RECIPIENT', this.postDepartmentTypeRecipient);
        data.set('STREET_RECIPIENT', this.streetRecipient);
        data.set('BUILDING_RECIPIENT', this.buildingRecipient);

        return data;
    }
}