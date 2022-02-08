 //time passed from date to now
exports.timePassed = (date) => {
    const today = new Date();
    const todayDate = today.getTime();
    const postDate = new Date(date).getTime();
    const diff = todayDate - postDate;
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (years > 0) {
      if (years === 1) {
        return `il y a ${years} an`;
      } else {
        return `il y a ${years} ans`;
      }
    }
    else if (months > 0) {
        return `il y a ${months} mois`; 
    }
    else if (weeks > 0) {
      if (weeks === 1) {
        return `il y a ${weeks} semaine`;
      } else {
        return `il y a ${weeks} semaines`;
      }
    } else if (days > 0) {
      if (days === 1) {
        return `il y a ${days} jour`;
      } else {
        return `il y a ${days} jours`;
      }
    } else if (hours > 0) {
      if (hours === 1) {
        return `il y a ${hours} heure`;
      } else {
        return `il y a ${hours} heures`;
      }
    } else if (minutes > 0) {
      if (minutes === 1) {
        return `il y a ${minutes} minute`;
      } else {
        return `il y a ${minutes} minutes`;
      }
    } else {
      return `il y a ${seconds} secondes`;
    }
  };