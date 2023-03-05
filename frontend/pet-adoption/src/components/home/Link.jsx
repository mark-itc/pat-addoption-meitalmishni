import Alert from 'react-bootstrap/Alert';
import './Link.css';

export function Link(props) {
    const { text } = props;

    return (
        <div className="alert-link">
            <Alert.Link href="/search">Find your new best friend</Alert.Link>
        </div>
    )
}
