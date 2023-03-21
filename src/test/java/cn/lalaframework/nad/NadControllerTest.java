package cn.lalaframework.nad;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;

@SpringBootTest(classes = TestApplication.class)
class NadControllerTest {
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @PostConstruct
    void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void html() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/index.html"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string("Cache-Control", "no-cache"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.TEXT_HTML));
    }

    @Test
    void js() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/static/js/main.f9347031.js"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string("Cache-Control", "max-age=8640000"))
                .andExpect(MockMvcResultMatchers.content().contentType("application/javascript"));
    }

    @Test
    void txt() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/a.txt"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void favicon() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/favicon.svg"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string("Cache-Control", "max-age=3600"))
                .andExpect(MockMvcResultMatchers.content().contentType("image/svg+xml"));
    }


    @Test
    void defs() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders
                                .get("/nad/api/defs")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("@.routes").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("@.classes").isArray());
    }
}