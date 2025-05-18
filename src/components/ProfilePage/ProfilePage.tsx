import { Edit, User, Phone } from 'lucide-react';
import './ProfilePage.scss';
import { useEffect, useState } from 'react';
import { getSubscriptionStatus, getUserData } from '../../API';
import Cookies from 'js-cookie';

const userImages = [
  'https://static.vecteezy.com/system/resources/previews/004/477/337/non_2x/face-young-man-in-frame-circular-avatar-character-icon-free-vector.jpg',
  'https://media.istockphoto.com/id/1446465512/vector/avatar-portrait-of-a-young-caucasian-girl-woman-in-round-frame.jpg?s=612x612&w=0&k=20&c=qomX6YxYq9bQNoevWfNF_ddlngbTS3YnHwLiyd7cMOo=',
  'https://www.shutterstock.com/image-vector/wavy-hair-caucasian-man-relaxed-600nw-2390634819.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0wLeph3wxBRf3CZJjQitLJVn4udf4sY8Ajw&s',
  'https://www.shutterstock.com/image-vector/humble-smile-latino-guy-relaxed-260nw-2387965715.jpg',
  'https://static.vecteezy.com/system/resources/previews/034/758/761/non_2x/top-knot-bun-latina-pretty-smiling-2d-avatar-illustration-headshot-hispanic-woman-big-earring-cartoon-character-face-portrait-relaxed-pose-flat-color-user-profile-image-isolated-on-white-vector.jpg'
]

const subscriptionPlans = [
  {
    type: 'basic',
    title: 'Basic Plan',
    features: [
      'Full access to all free movies',
      'Unlimited streaming',
      'HD quality',
      'No ads',
    ],
  },
  {
    type: 'premium',
    title: 'Premium Plan',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD & 4K quality',
      'No ads',
      'Offline downloads',
      'Priority customer support',
      'Early access to new releases',
    ],
  },
];

export default function ProfilePage() {
  const token = Cookies.get("authToken");
  const randomImage = userImages[Math.floor(Math.random() * userImages.length)];
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    number: '',
  });


  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData();
      setUserData({
        name: response.name,
        email: response.email,
        role: response.role,
        number: response.mobile_number,
      });
    }

    const fetchSubscriptionStatus = async () => {
      const response = await getSubscriptionStatus(String(token));
      setSubscriptionType(response.plan_type);
    }

    fetchUserData();
    fetchSubscriptionStatus();
  }, []);

  const currentPlan = subscriptionPlans.find(plan => plan.type === subscriptionType);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="avatar">
            <img src={randomImage} alt={userData.name} />
          </div>

          <div className="user-info">
            <h1>{userData.name}</h1>
            <p className="username">{userData.email}</p>
            <div className="user-details">
              <span><Phone /> {userData.number}</span>
              <span><User /> {userData.role}</span>
            </div>
          </div>

          <div className="edit-button-container">
            <button className="edit-button">
              <Edit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="main-content container">
        <div className="content-layout">
          {currentPlan && (
            <div className="bio-card">
              <h2><User /> {currentPlan.title}</h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {currentPlan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="tick">✔️</span>
                    <span className="feature-text">{feature}</span>
                  </li>

                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}