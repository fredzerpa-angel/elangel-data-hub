const checkNotificationStatus = (notification, type) => (req, res, next) => {  
  // Obtenemos el perfil del usuario del checkUserAuth middleware
  const { userProfile } = res.locals;

  // Leemos la configuracion de las notificaciones
  const notificationHabilitated = userProfile.notifications[notification][type];
  if (!notificationHabilitated) throw new Error('Notificación deshabilitada');

  return next(); // Si no hay error continuamos
}

module.exports = {
  checkNotificationStatus,
}