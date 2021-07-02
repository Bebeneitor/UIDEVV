export class EmailNotificationDto {
    emailNotificationConfigurationId: number;
    emailNotificationConfigurationName: string;
    recipientTo: string;
    recipientCC: string;
    recipientBCC: string;
    emailSubject: string;
    emailBody: string;
    userId: number;
    recipientEditable: boolean;
    emailFrom: string;
}
