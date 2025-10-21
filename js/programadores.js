window.addEventListener("DOMContentLoaded", () => {
    const tarjetas = document.querySelectorAll(".programador");

    tarjetas.forEach((tarjeta, index) => {
        
        tarjeta.style.opacity = 0;
        tarjeta.style.transform = "translateY(50px)";
        setTimeout(() => {
            tarjeta.style.transition = "all 0.6s ease-out";
            tarjeta.style.opacity = 1;
            tarjeta.style.transform = "translateY(0)";
        }, index * 150);

        const info = tarjeta.querySelector(".info-extra");

        tarjeta.addEventListener("mouseenter", () => {
            tarjeta.style.transform = "translateY(-8px) scale(1.05)";
            tarjeta.style.boxShadow = "0 12px 32px #bfa14a88";
            if(info){
                info.style.display = "block";
                setTimeout(() => info.style.opacity = 1, 50);
            }
        });

        tarjeta.addEventListener("mouseleave", () => {
            tarjeta.style.transform = "translateY(0) scale(1)";
            tarjeta.style.boxShadow = "0 4px 18px #bfa14a33";
            if(info){
                info.style.opacity = 0;
                setTimeout(() => info.style.display = "none", 400);
            }
        });
    });
});
