// ============================================================
// Loading Spinner Component
// ============================================================
function LoadingSpinner({ message = "Loading..." }) {
  const styles = {
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      minHeight: '200px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #1a73e8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingMsg: {
      marginTop: '16px',
      color: '#666',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.loading}>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}
      </style>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

export default LoadingSpinner;
