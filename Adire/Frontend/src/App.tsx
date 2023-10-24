import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ErrorScreen from './screens/ErrorScreen';
import CustomersScreen from './screens/CustomerScreen';
import DashboardScreen from './screens/DashboardScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import ReceiptsScreen from './screens/ReceiptsScreen';
import OrdersScreen from './screens/OrdersScreen';
import ViewcustomerScreen from './screens/ViewcustomerScreen';
import UpdateScreen from './screens/UpdateCustomerScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import AllOrderScreen from './screens/AllOrderScreen';
import UpdatePageScreen from './screens/UpdatePageScreen';
import VerifyEmail from './screens/VerifyEmailScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route
          path="/login/forgotpassword"
          element={<ForgotPasswordScreen />}
        />
        <Route
          path="/login/resetpassword/:token"
          element={<ResetPasswordScreen />}
        />
        <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/customers" element={<CustomersScreen />} />
        <Route
          path="/customers/viewcustomers"
          element={<ViewcustomerScreen />}
        />
        <Route path="/customers/update/:id" element={<UpdateScreen />} />
        <Route path="/others/receipts/" element={<ReceiptsScreen />} />
        <Route path="/others/receipt/:id" element={<ReceiptScreen />} />
        <Route path="/orders" element={<OrdersScreen />} />
        <Route path="/account/editprofile" element={<EditProfileScreen />} />
        <Route
          path="/account/changepassword"
          element={<ChangePasswordScreen />}
        />
        <Route path="/order/allorders" element={<AllOrderScreen />} />
        <Route path="/orders/update/:id1" element={<UpdatePageScreen />} />
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
