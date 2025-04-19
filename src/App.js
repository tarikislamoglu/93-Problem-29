import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { useReducer, useState } from "react";

// Aşağıdaki InviteUsers bileşeni, e-posta ile ekip üyesi davet etme işlemini gerçekleştirmektedir.
// Ancak şu anda herhangi bir state yönetimi bulunmamaktadır ve bileşen kullanıcı etkileşimine tepki vermemektedir.
// Amacınız useReducer kullanarak tam işlevsel bir davet bileşeni oluşturmak ve kullanıcı geri bildirimini iyileştirmektir.

// ✅ useReducer kullanarak e-posta adreslerini array içinde saklayın ve eklenen her e-postayı listeleyin.
// ✅ Kullanıcı  e-posta adresi eklediğinde ekrana “Ekip üyesi eklendi!” yerine, eklenen gerçek e-posta adresini gösterin.
// ✅ Kullanıcı yanlış formatta bir e-posta adresi girerse, input’un altına bir hata mesajı ekleyin (örn: “Geçersiz e-posta adresi”).
// ✅ Kullanıcının aynı e-posta adresini iki kez eklemesini önleyin ve uyarı mesajı gösterin.
// ✅ Kullanıcı eklenen e-postaları tek tek silebilmeli. Bir çöp kutusu ikonu ekleyerek her eklenen e-posta için “Sil” butonu oluşturun.

// Bonus:
// ✨ Input alanının içini Tailwind’in before: ve after: pseudo-elementleriyle süsleyin (örn: E-posta simgesi, animasyonlu bir underline).
// ✨ Kullanıcı hata mesajı aldığında input’un çerçevesi kırmızı renkte yanıp sönsün (animate-pulse).
// ✨ Eklenen e-posta adresleri için bir "etiket sistemi" oluşturun: Her e-posta adresi buton şeklinde bir etikete dönüştürülsün (bg-indigo-100 text-indigo-700 rounded-full px-2 py-1).
// ✨ Input alanı boşken buton disabled olsun ve opacity-50 cursor-not-allowed ile soluk görünsün.
// ✨ Kullanıcı bir e-posta eklediğinde, input alanı shake (titreme) animasyonu ile tepki versin (animate-wiggle gibi).
// ✨ Kullanıcı input’a tıklayınca, placeholder kaybolarak yukarı çıkacak şekilde bir efekt ekleyin (peer-placeholder-shown).

export default function InviteUsers() {
  const [inputValue, setInputValue] = useState("");
  const [animation, setAnimation] = useState(false);

  const reducer = (state, action) => {
    if (action.type === "ADD_EMAİL") {
      const email = action.payload;
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValid) {
        return { ...state, error: "Geçersiz E-posta Adresi", success: null };
      }
      if (state.emails.includes(email)) {
        return {
          ...state,
          error: "E-posta Adresi Listenizde Mevcut",
          success: null,
        };
      }

      return {
        emails: [...state.emails, email],
        error: null,
        success: `${email} Başarıyla Eklendi`,
      };
    } else if (action.type === "DELETE_EMAİL") {
      const updatedEmails = state.emails.filter(
        (email) => email !== action.payload
      );
      return { ...state, emails: updatedEmails, error: null, success: null };
    }
  };

  const initialState = {
    emails: [],
    error: null,
    success: null,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputValue("");
    setAnimation(true);
    setTimeout(() => setAnimation(false), 300);
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="mx-auto p-8 max-w-lg">
      <div>
        <Header />
        <form className="mt-6 flex" onSubmit={handleSubmit}>
          <label htmlFor="email" className="sr-only">
            E-mail adresiniz
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={`px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              state.error && "animate-pulse"
            } ${state.success && " animate-bounce "}`}
            placeholder="E-posta giriniz"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <button
            type="submit"
            className={`ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            ${!inputValue ? " opacity-50 cursor-not-allowed" : ""}`}
            disabled={!inputValue}
            onClick={() => dispatch({ type: "ADD_EMAİL", payload: inputValue })}
          >
            Davetiye gönderin
          </button>
        </form>
      </div>

      <div className="mt-10">
        <ul className="space-y-5">
          {state.emails.length > 0 ? (
            state.emails.map((email) => {
              return (
                <li key={email} className="flex justify-between">
                  <span className="bg-indigo-100 text-indigo-700 rounded-full px-2 py-1">
                    {email}
                  </span>
                  <button
                    onClick={() =>
                      dispatch({ type: "DELETE_EMAİL", payload: email })
                    }
                  >
                    X
                  </button>
                </li>
              );
            })
          ) : (
            <p className="bg-indigo-100 text-indigo-700 rounded-full px-2 py-1">
              Listeniz boş
            </p>
          )}
        </ul>
      </div>
      <div>
        {state.success && (
          <p className="mt-10 bg-green-500 text-white p-5 rounded-md animate-bounce">
            {state.success}
          </p>
        )}
        {state.error && (
          <p className="mt-10 bg-red-500 text-white p-5 rounded-md animate-pulse">
            {state.error}
          </p>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
        Ekip üyelerini davet edin
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Projenize henüz herhangi bir ekip üyesi eklemediniz. Projenin sahibi
        olarak, ekip üyesi izinlerini yönetebilirsiniz.
      </p>
    </div>
  );
}
