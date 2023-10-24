import { useQuery } from 'react-query';
import axios from 'axios';
import { apiUrl, clientUrl } from '../config/config';
import Sidebar from '../components/Reusable-Components/Sidebar/Sidebar';
import Navbar from '../components/Reusable-Components/Navbar/Navbar';
import Container from '../components/Reusable-Components/Container/Container';
import EditProfile from '../components/Profile/Edit-Profile/EditProfile';
import Loader from '../components/Reusable-Components/Loader/Loader';
import ServerError from '../components/Reusable-Components/ServerError/ServerError';

function EditProfileScreen() {
  const fetchUser = async () => {
    const token = document.cookie.split('=')[1];
    const response = await axios.get(`${apiUrl}/adire/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  };

  const { data, isLoading, isError, error } = useQuery('user', fetchUser);
  if (data) {
    return (
      <div>
        <Navbar />
        <Container>
          <EditProfile profile={data} />
        </Container>
        <Sidebar />
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    if ((error as any).response.status === 401) {
      window.location.href = `${clientUrl}/login`;
    } else if ((error as any).response.status === 403) {
      window.location.href = `${clientUrl}/forbidden`;
    } else return <ServerError />;
  }
}

export default EditProfileScreen;
