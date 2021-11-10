import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { flattenObject } from '../utils/helper';
import { Layout, PrefilledForm, WebSocket, Form } from '../components';
import { useTranslation } from 'react-i18next';
import useStep from '../utils/useStep';

const personalDataFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone'
];

const messages = {
    waiting: 'general.messages.waiting',
    connectionError: 'general.messages.connectionError',
    missing: 'general.messages.missing',
    verifying: 'general.messages.verifying'
};

const notify = (type: string, message: string, description: string) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

const emptyFields = [
    'CompanyName',
    'Designation',
    'StartDate',
    'EndDate',
    'EmployeeID'
];

const labels = {
    CompanyName: 'Company Name', 
    Designation: 'Designation',
    StartDate: 'Start Date',
    EndDate: 'End Date',
    EmployeeID: 'Employee ID'
};

const EmployerData: React.FC = ({ history, match }: any) => {
    const [webSocket, setWebSocket] = useState(false);
    const [fields, setFields] = useState<object>();
    const [status, setStatus] = useState('');
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({});
    const [prefilledCollegeData, setPrefilledCollegeData] = useState({});
    const { nextStep } = useStep(match);

    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                notify('error', 'Error', t(messages.connectionError));
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const personalData = personalDataFields.reduce((acc: any, entry: string) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledPersonalData({ ...personalData, ...address });

            
            const collegeDegreeString: string | null = await localStorage.getItem('highestDegree');
            const collegeDegree = collegeDegreeString && await JSON.parse(collegeDegreeString);
            const flattenCollegeDetails = flattenObject(collegeDegree);

            setPrefilledCollegeData(flattenCollegeDetails)

        }
        getData();
    }, []);

    async function processValues(fields: object) {
        setFields(fields);
        setWebSocket(true);
    }

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData };
    const prefilledCollegeFormData: any = { dataFields: prefilledCollegeData };
    const emptyFormData: any = { dataFields: emptyFields, labels, processValues, status, messages, nextStep: nextStep};

    return (
        <Layout match={match}>
            <div className='company-data-page-wrapper'>
                <h2>{t('pages.employerData.previousEmployerWebsite')}</h2>
                <h3 className='section-header'>{t('pages.employerData.candidateDetails')}</h3>
                <PrefilledForm {...prefilledPersonalFormData} />

                <h3 className='section-header'>{t('pages.employerData.highestDegreeDetails')}</h3>
                <PrefilledForm {...prefilledCollegeFormData} />

                <h3 className='section-header'>{t('pages.employerData.employerDetails')}</h3>
                <Form {...emptyFormData} />
            </div>
        </Layout>
    );
};

export default EmployerData;
