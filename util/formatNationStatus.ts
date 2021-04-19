export default function (status: 'Pending' | 'Unfinished' | 'Done') {
    switch(status) {
        case 'Pending':
            return '❌';
        case 'Unfinished':
            return '👨‍🏭';
        case 'Done':
            return '✔️';
    }
}
