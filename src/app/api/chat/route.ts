import { NextResponse } from "next/server";
import axios from "axios";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const getAIConfig = (apiKey: string) => {
  if (apiKey.startsWith('sk-or')) {
    return {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'openrouter/auto',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Animal Rescue Connect'
      }
    };
  } else {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };
  }
};

const REGIONAL_MOCK_REPLIES: Record<string, Record<string, string>> = {
  English: {
    bleeding: `🩸 **FIRST AID FOR BLEEDING:**
1. **Apply Direct Pressure:** Press a clean cloth or bandage firmly on the wound for 5-10 minutes. Do not lift the cloth to check.
2. **Elevate:** Gently lift the injured limb above heart level if it does not cause pain.
3. **Wrap Warmly:** Wrap the animal in a blanket to keep them warm and prevent shock.
4. **Transit:** Take them to a vet immediately. Check our **Map** tab for nearby open hospitals.`,
    fracture: `🦴 **FIRST AID FOR FRACTURES/BROKEN BONES:**
1. **Restrict Movement:** Keep the animal confined in a box or kennel. Do NOT try to re-align or splint the bone.
2. **Protect Yourself:** Injured animals may bite. Handle with a thick towel.
3. **Open Wounds:** Gently cover exposed bones/wounds with a sterile gauze.
4. **Emergency Transport:** Carry them flat on a rigid surface to prevent further damage.`,
    heatstroke: `☀️ **FIRST AID FOR HEAT STROKE / OVERHEATING:**
1. **Move to Shade:** Move the animal to a cool, shaded, or air-conditioned area.
2. **Cool Down:** Pour cool (not freezing) water over their body, especially on paws, neck, and belly. Do NOT use ice.
3. **Hydrate:** Offer fresh water, but do not force them to drink.
4. **Seek Vet Care:** Severe overheating can damage internal organs. Seek professional care.`,
    choking: `💨 **FIRST AID FOR CHOKING:**
1. **Check Mouth:** Carefully inspect their mouth. If visible, gently swipe the object out (mind your fingers!).
2. **Chest Compressions:** If unconscious or unable to breathe, apply firm, rhythmic pressure to the sides of the chest.
3. **Heimlich Maneuver:** For larger dogs, apply quick upward thrusts behind the rib cage.
4. **Urgent Vet Transit:** Carry them to the clinic immediately.`,
    default: `🐾 **Rescue Bot - First Aid Guidance:**
I can guide you on immediate steps to stabilize an animal. Try typing or selecting:
* **Bleeding**
* **Broken bone / fracture**
* **Overheating / Heat stroke**
* **Choking**

*(Admin: Configure \`OPENAI_API_KEY\` in your environment to activate live LLM replies!)*`
  },
  Spanish: {
    bleeding: `🩸 **PRIMEROS AUXILIOS PARA SANGRADO:**
1. **Aplicar Presión Directa:** Presione firmemente con un paño limpio o venda sobre la herida durante 5-10 minutos. No levante el paño.
2. **Elevar:** Levante suavemente la extremidad lesionada por encima del nivel del corazón si no causa dolor.
3. **Mantener Caliente:** Envuelva al animal en una manta para mantenerlo caliente y prevenir el shock.
4. **Traslado:** Llévelo al veterinario de inmediato. Consulte el **Mapa** para ver clínicas cercanas.`,
    fracture: `🦴 **PRIMEROS AUXILIOS PARA FRACTURAS / HUESOS ROTOS:**
1. **Restringir Movimiento:** Mantenga al animal confinado en una caja o transportín. NO intente alinear el hueso.
2. **Protegerse:** Los animales heridos pueden morder. Manéjelo con una toalla gruesa.
3. **Heridas Abiertas:** Cubra suavemente los huesos o heridas expuestos con una gasa estéril.
4. **Transporte de Emergencia:** Trasládelo sobre una superficie rígida y plana.`,
    heatstroke: `☀️ **PRIMEROS AUXILIOS PARA GOLPE DE CALOR:**
1. **Mover a la Sombra:** Lleve al animal a una zona fresca, a la sombra o con aire acondicionado.
2. **Enfriar:** Vierta agua templada o fresca (no helada) sobre su cuerpo, patas y vientre. NO use hielo.
3. **Hidratar:** Ofrezca agua fresca, pero no lo obligue a beber.
4. **Atención Veterinaria:** El sobrecalentamiento grave puede dañar órganos internos. Busque atención profesional.`,
    choking: `💨 **PRIMEROS AUXILIOS PARA ASFIXIA:**
1. **Revisar Boca:** Inspeccione la boca con cuidado. Si el objeto es visible, retírelo con cuidado.
2. **Compresiones Torácicas:** Si está inconsciente, aplique presión firme y rítmica a los lados del pecho.
3. **Maniobra de Heimlich:** Para perros grandes, aplique presiones hacia arriba detrás de la caja torácica.
4. **Traslado Urgente:** Llévelo a la clínica de inmediato.`,
    default: `🐾 **Asistente de Rescate - Guía de Primeros Auxilios:**
Puedo guiarle sobre los pasos inmediatos para estabilizar a un animal. Intente escribir o seleccionar:
* **Sangrado**
* **Hueso roto / fractura**
* **Golpe de calor**
* **Asfixia**`
  },
  French: {
    bleeding: `🩸 **PREMIERS SECOURS EN CAS DE SAIGNEMENT :**
1. **Pression directe :** Appuyez fermement sur la plaie avec un chiffon propre pendant 5 à 10 minutes.
2. **Élever :** Soulevez doucement le membre blessé au-dessus du niveau du cœur si cela ne fait pas mal.
3. **Garder au chaud :** Enveloppez l'animal dans une couverture pour éviter le choc.
4. **Urgence :** Emmenez-le immédiatement chez le vétérinaire.`,
    fracture: `🦴 **PREMIERS SECOURS EN CAS DE FRACTURE :**
1. **Limiter les mouvements :** Gardez l'animal dans une boîte ou une cage. Ne tentez pas de remettre l'os en place.
2. **Se protéger :** Utilisez une serviette épaisse pour manipuler l'animal blessé.
3. **Plaie ouverte :** Couvrez doucement avec une gaze stérile.
4. **Transport à plat :** Transportez l'animal sur une surface rigide et plate.`,
    heatstroke: `☀️ **PREMIERS SECOURS EN CAS DE COUP DE CHALEUR :**
1. **Mettre à l'ombre :** Déplacez l'animal dans un endroit frais ou climatisé.
2. **Refroidir :** Mouillez son corps avec de l'eau fraîche (pas glacée), surtout les pattes et le ventre.
3. **Hydrater :** Proposez de l'eau fraîche sans le forcer.
4. **Vétérinaire :** Un coup de chaleur peut être mortel, consultez d'urgence.`,
    choking: `💨 **PREMIERS SECOURS EN CAS D'ÉTOUFFEMENT :**
1. **Inspecter la bouche :** Si l'objet est visible, retirez-le délicatement.
2. **Compressions thoraciques :** Appliquez des pressions fermes sur les côtés de la cage thoracique.
3. **Manœuvre de Heimlich :** Appliquez des poussées sous les côtes pour les grands chiens.
4. **Transit urgent :** Emmenez l'animal immédiatement chez le vétérinaire.`,
    default: `🐾 **Assistant de sauvetage - Premiers secours :**
Je peux vous guider sur les gestes à faire. Essayez de taper ou sélectionner :
* **Saignement**
* **Os cassé / fracture**
* **Coup de chaleur**
* **Étouffement**`
  },
  German: {
    bleeding: `🩸 **ERSTE HILFE BEI BLUTUNGEN:**
1. **Direkten Druck ausüben:** Drücken Sie 5-10 Minuten lang ein sauberes Tuch fest auf die Wunde.
2. **Hochlagern:** Heben Sie die verletzte Gliedmaße vorsichtig über Herzhöhe an, wenn dies keine Schmerzen verursacht.
3. **Warm einpacken:** Wickeln Sie das Tier in eine Decke, um Schock vorzubeugen.
4. **Tierarzt:** Bringen Sie das Tier sofort zum Tierarzt.`,
    fracture: `🦴 **ERSTE HILFE BEI KNOCHENBRÜCHEN:**
1. **Bewegung einschränken:** Halten Sie das Tier in einer Box oder einem Zwinger. Versuchen Sie NICHT, den Knochen zu richten.
2. **Selbstschutz:** Verletzte Tiere können beißen. Nutzen Sie ein dickes Handtuch.
3. **Offene Wunden:** Decken Sie die Wunde vorsichtig mit steriler Gaze ab.
4. **Transport:** Transportieren Sie das Tier flach auf einer festen Unterlage.`,
    heatstroke: `☀️ **ERSTE HILFE BEI HITZSCHLAG:**
1. **In den Schatten bringen:** Bringen Sie das Tier in einen kühlen oder klimatisierten Bereich.
2. **Abkühlen:** Gießen Sie kühles (nicht eiskaltes) Wasser über Körper, Pfoten und Bauch.
3. **Trinken anbieten:** Bieten Sie frisches Wasser an, ohne Zwang.
4. **Tierarzt aufsuchen:** Ein Hitzschlag kann innere Organe schädigen.`,
    choking: `💨 **ERSTE HILFE BEI ERSTICKUNGSGEFAHR:**
1. **Maul kontrollieren:** Suchen Sie vorsichtig nach Fremdkörpern und entfernen Sie diese.
2. **Herzdruckmassage:** Drücken Sie rhythmisch und fest auf die Seiten des Brustkorbs.
3. **Heimlich-Griff:** Führen Sie bei größeren Hunden Druckstöße hinter dem Rippenbogen durch.
4. **Sofort zum Tierarzt:** Transportieren Sie das Tier unverzüglich.`,
    default: `🐾 **Rettungsassistent - Erste Hilfe:**
Ich kann Ihnen helfen, ein Tier zu stabilisieren. Schreiben oder wählen Sie:
* **Blutung**
* **Knochenbruch**
* **Hitzschlag**
* **Erstickungsgefahr**`
  },
  Hindi: {
    bleeding: `🩸 **रक्तस्राव (खून बहने) के लिए प्राथमिक चिकित्सा:**
1. **सीधा दबाव डालें:** घाव पर 5-10 मिनट के लिए एक साफ कपड़ा या पट्टी मजबूती से दबाएं।
2. **ऊंचा उठाएं:** यदि दर्द न हो तो चोटिल अंग को दिल के स्तर से ऊपर उठाएं।
3. **गर्म रखें:** जानवर को शॉक से बचाने के लिए कंबल में लपेटें।
4. **पशु चिकित्सक:** तुरंत डॉक्टर के पास ले जाएं। हमारी **Map** टैब पर नजदीकी अस्पताल देखें।`,
    fracture: `🦴 **टूटी हड्डी / फ्रैक्चर के लिए प्राथमिक चिकित्सा:**
1. **हिलना-डुलना बंद करें:** जानवर को एक बॉक्स या पिंजरे में रखें। हड्डी को सीधा करने की कोशिश न करें।
2. **खुद को सुरक्षित रखें:** घायल जानवर काट सकते हैं। मोटे तौलिए का उपयोग करें।
3. **खुला घाव:** उजागर हड्डियों/घावों को बाँझ धुंध (sterilized gauze) से ढकें।
4. **परिवहन:** उन्हें एक सपाट और कठोर सतह पर ले जाएं।`,
    heatstroke: `☀️ **लू लगना / गर्मी के लिए प्राथमिक चिकित्सा:**
1. **छाया में ले जाएं:** जानवर को ठंडी या वातानुकूलित जगह पर ले जाएं।
2. **ठंडा करें:** शरीर, पंजों और पेट पर ठंडा (बर्फ का नहीं) पानी डालें।
3. **पानी पिलाएं:** ताजा पानी दें, लेकिन जबरदस्ती न करें।
4. **डॉक्टर से मिलें:** गंभीर गर्मी आंतरिक अंगों को नुकसान पहुंचा सकती है।`,
    choking: `💨 **दम घुटने पर प्राथमिक चिकित्सा:**
1. **मुंह की जांच करें:** मुंह के अंदर देखें और यदि कोई वस्तु दिखाई दे तो उसे निकालें।
2. **छाती दबाएं:** यदि सांस न आ रही हो, तो छाती के दोनों किनारों पर हल्का दबाव डालें।
3. **हेमलिच पैंतरेबाज़ी (Heimlich Maneuver):** बड़े कुत्तों के लिए, पसली के पीछे ऊपर की ओर दबाव डालें।
4. **तुरंत अस्पताल ले जाएं:** देरी न करें।`,
    default: `🐾 **बचाव सहायक - प्राथमिक चिकित्सा मार्गदर्शन:**
मैं आपको जानवर को स्थिर करने के उपायों के बारे में बता सकता हूँ। टाइप करें या चुनें:
* **रक्तस्राव (Bleeding)**
* **टूटी हड्डी (Fracture)**
* **लू लगना (Heat stroke)**
* **दम घुटना (Choking)**`
  },
  Bengali: {
    bleeding: `🩸 **রক্তপাতের প্রাথমিক চিকিৎসা:**
১. **সরাসরি চাপ দিন:** ক্ষতস্থানে একটি পরিষ্কার কাপড় বা ব্যান্ডেজ দিয়ে ৫-১০ মিনিট ধরে চেপে রাখুন।
২. **উঁচু করুন:** ব্যথা না পেলে আঘাতপ্রাপ্ত অঙ্গটি হৃদপিণ্ডের স্তরের ওপরে তুলুন।
৩. **উষ্ণ রাখুন:** শক প্রতিরোধ করতে পশুটিকে কম্বলে জড়িয়ে রাখুন।
৪. **স্থানান্তর:** অবিলম্বে পশুচিকিত্সকের কাছে নিয়ে যান। কাছাকাছি হাসপাতালের জন্য আমাদের **Map** ট্যাব দেখুন।`,
    fracture: `🦴 **ভাঙা হাড় / ফ্র্যাকচারের প্রাথমিক চিকিৎসা:**
১. **নড়াচড়া সীমাবদ্ধ করুন:** পশুটিকে একটি বাক্স বা খাঁচায় আবদ্ধ রাখুন। হাড় সোজা করার চেষ্টা করবেন না।
২. **নিজেকে রক্ষা করুন:** আহত পশু কামড়াতে পারে। একটি মোটা তোয়ালে ব্যবহার করুন।
৩. **উন্মুক্ত ক্ষত:** উন্মুক্ত হাড় বা ক্ষত জীবাণুমুক্ত গজ দিয়ে আলতো করে ঢেকে দিন।
৪. **জরুরী পরিবহন:** একটি শক্ত সমতল পৃষ্ঠের উপর শুইয়ে নিয়ে যান।`,
    heatstroke: `☀️ **হিট স্ট্রোক / অতিরিক্ত গরমের প্রাথমিক চিকিৎসা:**
১. **ছায়ায় নিয়ে যান:** পশুটিকে শীতল বা শীতাতপ নিয়ন্ত্রিত স্থানে নিয়ে যান।
২. **ঠান্ডা করুন:** শরীরের ওপর, বিশেষ করে থাবা এবং পেটে ঠান্ডা (বরফ নয়) জল ঢালুন।
৩. **জল খাওয়ান:** তাজা জল দিন, কিন্তু জোর করবেন না।
৪. **ডাক্তারের পরামর্শ:** অতিরিক্ত গরমের কারণে অভ্যন্তরীণ অঙ্গগুলির ক্ষতি হতে পারে।`,
    choking: `💨 **শ্বাসরোধের প্রাথমিক চিকিৎসা:**
১. **মুখ পরীক্ষা করুন:** মুখের ভেতরটি সাবধানে পরীক্ষা করুন। কোনো বস্তু দৃশ্যমান হলে তা বের করে আনুন।
২. **বুকের সংকোচন:** অচেতন হলে বুকের দুই পাশে ছন্দময় চাপ প্রয়োগ করুন।
৩. **হেইমলিচ কৌশল (Heimlich Maneuver):** বড় কুকুরের ক্ষেত্রে পাঁজরের খাঁচার ঠিক পিছনে ওপরের দিকে চাপ দিন।
৪. **অবিলম্বে স্থানান্তর:** দ্রুত পশুচিকিত্সকের কাছে নিয়ে যান।`,
    default: `🐾 **উদ্ধারকারী সহকারী - প্রাথমিক চিকিৎসা নির্দেশিকা:**
আমি আপনাকে পশুটিকে স্থিতিশীল করার জন্য তাত্ক্ষণিক পদক্ষেপ নির্দেশ করতে পারি। লিখুন বা চয়ন করুন:
* **রক্তপাত (Bleeding)**
* **ভাঙা হাড় (Fracture)**
* **হিট স্ট্রোক (Heat stroke)**
* **শ্বাসরোধ (Choking)**`
  }
};

export async function POST(req: Request) {
  try {
    const { message, history = [], language = "English" } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Offline fallback responder using the regional translations
      const text = message.toLowerCase();
      const replies = REGIONAL_MOCK_REPLIES[language] || REGIONAL_MOCK_REPLIES.English;
      let reply = replies.default;
      
      if (
        text.includes("bleed") || text.includes("cut") || text.includes("wound") || text.includes("blood") ||
        text.includes("sangrado") || text.includes("sangre") || text.includes("saignement") || text.includes("blutung") ||
        text.includes("रक्त") || text.includes("खून") || text.includes("রক্ত")
      ) {
        reply = replies.bleeding;
      } else if (
        text.includes("fracture") || text.includes("broken") || text.includes("bone") || text.includes("leg") ||
        text.includes("roto") || text.includes("hueso") || text.includes("fracture") || text.includes("bruch") ||
        text.includes("हड्डी") || text.includes("ভাঙা") || text.includes("হাড়")
      ) {
        reply = replies.fracture;
      } else if (
        text.includes("heat") || text.includes("hot") || text.includes("stroke") || text.includes("pant") ||
        text.includes("calor") || text.includes("chaleur") || text.includes("hitzschlag") ||
        text.includes("गर्मी") || text.includes("लू") || text.includes("হিট")
      ) {
        reply = replies.heatstroke;
      } else if (
        text.includes("chok") || text.includes("breath") || text.includes("throat") ||
        text.includes("asfixia") || text.includes("étouffement") || text.includes("ersticken") ||
        text.includes("दम") || text.includes("শ্বাস")
      ) {
        reply = replies.choking;
      }
      return NextResponse.json({ reply, isMock: true });
    }

    // Connect to live OpenAI / OpenRouter
    const config = getAIConfig(apiKey);
    
    const formattedHistory = history.map((h: { sender: string; text: string }) => ({
      role: h.sender === "bot" ? "assistant" : "user",
      content: h.text
    }));

    const messages: Message[] = [
      {
        role: "system",
        content: `You are an expert veterinary first-aid assistant for 'Animal Rescue Connect'. Provide immediate, highly structured, and actionable emergency stabilization instructions for sick/injured stray animals. Keep answers under 150 words. Focus strictly on steps the reporter can do right now before a vet arrives. Warn if handling is dangerous. Keep tone urgent but reassuring. IMPORTANT: You must respond entirely in the following selected language: ${language}.`
      },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    const response = await axios.post(
      config.url,
      {
        model: config.model,
        messages: messages,
        max_tokens: 300,
        temperature: 0.3
      },
      { headers: config.headers }
    );

    const reply = response.data.choices[0]?.message?.content || "";
    return NextResponse.json({ reply, isMock: false });

  } catch (err: any) {
    console.error("❌ AI Route Error:", err.response?.data || err.message);
    return NextResponse.json({ 
      reply: "Sorry, I encountered an issue connecting to the AI brain. Please stabilize the animal and check the Map tab for nearby veterinary facilities.",
      error: err.message 
    }, { status: 500 });
  }
}
