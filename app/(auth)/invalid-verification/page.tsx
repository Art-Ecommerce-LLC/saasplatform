import React from 'react';

const InvalidVerificationPage: React.FC = () => {
    return (
        <div>
            <h1>Invalid Verification Link</h1>
            <p>The verification link you clicked is invalid.</p>
            <p>Please resend a verification link to your email address.</p>
            {/* Add your resend verification link functionality here */}
        </div>
    );
};

export default InvalidVerificationPage;